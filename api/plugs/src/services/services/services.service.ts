import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Service, ServiceDocument } from '../schemas/service.schema';
import { Model } from 'mongoose';
import {
  ActionDescription,
  EventDescription,
  InitializeRequestDto,
} from '../dto/InitializeRequest.dto';
import { ServicePreviewDto } from '../dto/ServicePreview.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
  ) {}

  async exists(serviceName: string): Promise<boolean> {
    const service = await this.serviceModel.findOne({ name: serviceName });

    return !!service;
  }

  async create(service: InitializeRequestDto): Promise<Service> {
    const createdService = await this.serviceModel.create(service);

    return createdService.save();
  }

  async update(
    serviceName: string,
    service: InitializeRequestDto,
  ): Promise<Service> {
    const updatedService = await this.serviceModel.findOneAndUpdate(
      { name: serviceName },
      service,
    );

    return updatedService.save();
  }

  async findByName(serviceName: string): Promise<Service> {
    return this.serviceModel.findOne({ name: serviceName }).lean().exec();
  }

  async listServicesPreview(userId: number): Promise<ServicePreviewDto[]> {
    return this.serviceModel.aggregate([
      {
        $lookup: {
          from: 'userconnections',
          localField: 'name',
          foreignField: 'service',
          as: 'user_data',
        },
      },
      {
        $addFields: {
          user_data: {
            $filter: {
              input: '$user_data',
              as: 'user',
              cond: {
                $eq: ['$$user.userId', userId],
              },
            },
          },
        },
      },
      {
        $addFields: {
          connected: {
            $in: [true, '$user_data.connected'],
          },
        },
      },
      {
        $project: {
          _id: 0,
          __v: 0,
          user_data: 0,
          events: 0,
          actions: 0,
        },
      },
    ]);
  }

  async listAboutServices() {
    return this.serviceModel.aggregate([
      {
        $project: {
          events: {
            $map: {
              input: '$events',
              as: 'event',
              in: {
                name: '$$event.name',
                description: '$$event.description',
              },
            },
          },
          actions: {
            $map: {
              input: '$actions',
              as: 'action',
              in: {
                name: '$$action.name',
                description: '$$action.description',
              },
            },
          },
          name: 1,
        },
      },
      {
        $unset: ['_id', '__v'],
      },
    ]);
  }

  async listEvents(serviceName: string): Promise<EventDescription[]> {
    const service = await this.findByName(serviceName);

    return service.events;
  }

  async listActions(serviceName: string): Promise<ActionDescription[]> {
    const service = await this.findByName(serviceName);

    return service.actions;
  }
}
