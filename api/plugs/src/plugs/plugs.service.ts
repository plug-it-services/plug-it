import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Plug, PlugDocument } from './schemas/plug.schema';
import { PlugSubmitDto } from './dto/PlugSubmit.dto';
import { Step } from './dto/Step.dto';
import { ServicesService } from '../services/services/services.service';
import { Service } from '../services/schemas/service.schema';
import {
  ActionDescription,
  EventDescription,
  Field,
  Variable,
} from '../services/dto/InitializeRequest.dto';

export type PlugWithId = Plug & { id: string };

@Injectable()
export class PlugsService {
  logger = new Logger(PlugsService.name);

  constructor(
    @InjectModel(Plug.name) private plugsModel: Model<PlugDocument>,
    private readonly servicesService: ServicesService,
  ) {}

  private format(plug: any): PlugWithId {
    plug.id = plug._id;
    delete plug._id;
    delete plug.__v;
    return plug;
  }

  private formatAll(plugs: any[]): Plug[] {
    return plugs.map((plug) => {
      return this.format(plug);
    });
  }

  async findByOwner(
    owner: number,
  ): Promise<(PlugWithId & { icons: string[] })[]> {
    const plugs = await this.plugsModel
      .aggregate([
        {
          $match: {
            owner: owner,
          },
        },
        {
          $lookup: {
            from: 'services',
            localField: 'event.serviceName',
            foreignField: 'name',
            as: 'icons',
          },
        },
        {
          $lookup: {
            from: 'services',
            let: {
              names: '$actions.serviceName',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ['$name', '$$names'],
                  },
                },
              },
            ],
            as: 'actionsIcons',
          },
        },
        {
          $project: {
            name: 1,
            enabled: 1,
            owner: 1,
            event: 1,
            actions: 1,
            icons: {
              $concatArrays: ['$icons.icon', '$actionsIcons.icon'],
            },
          },
        },
      ])
      .exec();

    return this.formatAll(plugs) as any[];
  }

  async findById(id: string): Promise<Plug | null> {
    const oid = new mongoose.Types.ObjectId(id);
    const plug = await this.plugsModel
      .aggregate([
        {
          $match: {
            _id: oid,
          },
        },
        {
          $lookup: {
            from: 'services',
            localField: 'event.serviceName',
            foreignField: 'name',
            as: 'icons',
          },
        },
        {
          $lookup: {
            from: 'services',
            let: {
              names: '$actions.serviceName',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ['$name', '$$names'],
                  },
                },
              },
            ],
            as: 'actionsIcons',
          },
        },
        {
          $project: {
            name: 1,
            enabled: 1,
            owner: 1,
            event: 1,
            actions: 1,
            icons: {
              $concatArrays: ['$icons.icon', '$actionsIcons.icon'],
            },
          },
        },
      ])
      .exec();

    return plug.length ? this.format(plug[0]) : null;
  }

  async findOwnedByEvent(
    owner: number,
    serviceName: string,
    eventId: string,
  ): Promise<PlugWithId> {
    const plug = await this.plugsModel
      .findOne({
        owner,
        enabled: true,
        'event.serviceName': serviceName,
        'event.id': eventId,
      })
      .lean()
      .exec();

    return this.format(plug);
  }

  async create(owner: number, plug: PlugSubmitDto): Promise<Plug> {
    const toCreate = plug as any as Plug;
    toCreate.owner = owner;
    const createdPlug = await this.plugsModel.create(plug);

    const created = await createdPlug.save();
    return this.format(created.toJSON());
  }

  async update(id: string, plug: PlugSubmitDto): Promise<Plug> {
    const updated = await this.plugsModel
      .findByIdAndUpdate(id, plug)
      .lean()
      .exec();

    return this.format(updated);
  }

  async editEnabled(id: string, enabled: boolean): Promise<Plug> {
    const updated = await this.plugsModel
      .findByIdAndUpdate(id, { enabled: enabled })
      .lean()
      .exec();

    return this.format(updated);
  }

  async delete(id: string): Promise<void> {
    return this.plugsModel.findByIdAndDelete(id);
  }

  async verifyServicesConnected(
    userId: number,
    plug: PlugSubmitDto,
  ): Promise<void> {
    const services = await this.servicesService.listServicesPreview(userId);

    const servicesNames = services
      .filter((service) => service.connected)
      .map((service) => service.name);

    if (!servicesNames.includes(plug.event.serviceName)) {
      this.logger.log(
        `Service ${plug.event.serviceName} is not connected for user ${userId}`,
      );
      throw new BadRequestException(
        `Service ${plug.event.serviceName} is not connected`,
      );
    }

    for (const action of plug.actions) {
      if (!servicesNames.includes(action.serviceName)) {
        this.logger.log(
          `Service ${action.serviceName} is not connected for user ${userId}`,
        );
        throw new BadRequestException(
          `Service ${action.serviceName} is not connected`,
        );
      }
    }
  }

  async validateSteps(plug: PlugSubmitDto): Promise<void> {
    const service = await this.findStepService(plug.event);
    const eventDescription = await this.findStepEvent(service, plug.event);
    const variablesMap = new Map<string, Variable[]>();

    await this.validateStepFields(plug.event, eventDescription, variablesMap);
    variablesMap.set('0', eventDescription.variables);

    for (const [idx, action] of plug.actions.entries()) {
      const actionService = await this.findStepService(action);
      const actionDescription = await this.findStepAction(
        actionService,
        action,
      );

      await this.validateStepFields(action, actionDescription, variablesMap);

      variablesMap.set((idx + 1).toString(), actionDescription.variables);
    }
  }

  private async findStepService(step: Step): Promise<Service> {
    const service = await this.servicesService.findByName(step.serviceName);

    if (!service) {
      this.logger.log(
        `Requested service ${step.serviceName} not found while validating step`,
      );
      throw new HttpException('Requested service not found', 400);
    }

    return service;
  }

  private async findStepEvent(service, step: Step): Promise<EventDescription> {
    const eventDescription = service.events.find((e) => e.id === step.id);
    if (!eventDescription) {
      this.logger.log(
        `Requested event ${step.id} in ${service.name} not found while validating event`,
      );
      throw new HttpException('Requested event not found', 400);
    }
    return eventDescription;
  }

  private async findStepAction(
    service,
    step: Step,
  ): Promise<ActionDescription> {
    const actionDescription = service.actions.find((e) => e.id === step.id);
    if (!actionDescription) {
      this.logger.log(
        `Requested action ${step.id} in ${service.name} not found while validating action`,
      );
      throw new HttpException('Requested action not found', 400);
    }
    return actionDescription;
  }

  private async validateStepFields(
    step: Step,
    config: ActionDescription | EventDescription,
    variables: Map<string, Variable[]>,
  ): Promise<void> {
    let requiredFields = config.fields.filter((f) => f.required);

    for (const field of step.fields) {
      const actionField = await this.findActionField(config, field.key);

      if (typeof field.value !== 'string') {
        this.logger.log(
          `Field ${field.key} in ${config.name} action has invalid value : not a string`,
        );
        throw new HttpException('Invalid field value', 400);
      }
      if (field.value.includes('${')) {
        await this.validateFieldWithVariables(
          field.value,
          variables,
          actionField,
        );
      } else {
        this.validateFieldType(field.value, actionField.type);
      }
      requiredFields = requiredFields.filter((f) => f.key !== field.key);
    }
    if (requiredFields.length > 0) {
      this.logger.log(
        `Required fields ${requiredFields.map(
          (f) => f.key,
        )} not found while validating action`,
      );
      throw new HttpException('Required fields not found', 400);
    }
  }

  private async findActionField(
    actionConfig: ActionDescription,
    key: string,
  ): Promise<Field> {
    const field = actionConfig.fields.find((f) => f.key === key);

    if (!field) {
      this.logger.log(
        `Requested field ${key} in ${actionConfig.name} action not found while validating action`,
      );
      throw new HttpException('Requested field not found', 400);
    }
    return field;
  }

  private async validateFieldWithVariables(
    value: string,
    variables: Map<string, Variable[]>,
    field: Field,
  ): Promise<boolean> {
    let idx = value.indexOf('${');
    let found = false;

    while (idx !== -1) {
      found = true;
      const endIdx = value.indexOf('}', idx + 2);
      if (endIdx === -1) {
        this.logger.log(
          `Invalid variable reference in ${field.key} field while validating action`,
        );
        throw new HttpException('Invalid variable reference', 400);
      }
      const variable = value.substring(idx + 2, endIdx);
      await this.validateVariableReference(variable, variables, field);
      idx = value.indexOf('$', endIdx);
    }
    return found;
  }

  private async validateVariableReference(
    variable: string,
    variables: Map<string, Variable[]>,
    field: Field,
  ) {
    const [provider, key] = variable.split('.');

    if (!variables.has(provider)) {
      this.logger.log(
        `Requested variable ${variable} in ${field.key} field not found while validating action`,
      );
      throw new HttpException('Requested variable not found', 400);
    }

    const definition = variables.get(provider).find((v) => v.key === key);
    if (!definition) {
      this.logger.log(
        `Requested variable ${variable} in ${field.key} field not found while validating action`,
      );
      console.log('definition');
      throw new HttpException('Requested variable not found', 400);
    }

    if (definition.type !== field.type) {
      this.logger.log(
        `Requested variable ${variable} in ${field.key} field has wrong type while validating action: got ${definition.type}, expected ${field.type}`,
      );
      throw new HttpException('Requested variable has wrong type', 400);
    }
  }

  private validateFieldType(value: string, type: string) {
    let result;

    switch (type) {
      case 'string':
        result = typeof value === 'string';
        break;
      case 'number':
        result = !isNaN(parseFloat(value));
        break;
      case 'boolean':
        result = value === 'true' || value === 'false';
        break;
      default:
        result = false;
    }
    if (!result) {
      this.logger.log(
        `Requested field has wrong type while validating action: got '${value}', expected type ${type}`,
      );
      throw new HttpException('Requested field has wrong type', 400);
    }
  }
}
