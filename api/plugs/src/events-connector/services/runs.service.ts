import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Run, RunDocument } from '../schemas/run.schema';
import { Variable } from '../../dto/Variable.dto';
import { Plug } from '../../plugs/schemas/plug.schema';
import { Service } from '../../services/schemas/service.schema';

export type RunWithId = Run & { id: string };

@Injectable()
export class RunsService {
  constructor(@InjectModel(Run.name) private runModel: Model<RunDocument>) {}

  private format(run: any): RunWithId {
    run.id = run._id;
    delete run._id;
    delete run.__v;
    return run;
  }

  async create(plugId: string, variables: Variable[]): Promise<RunWithId> {
    const toCreate = new this.runModel({
      plugId,
      stepIdx: 0,
      variables: [variables],
    });

    const run = await toCreate.save();
    return this.format(run.toJSON());
  }

  async findById(
    id: string,
  ): Promise<
    RunWithId & { plug: Plug; service: Service /*; nextService: Service*/ }
  > {
    const toFormat = await this.runModel
      .aggregate([
        {
          $match: {
            _id: id,
          },
        },
        {
          $lookup: {
            from: 'plugs',
            localField: 'plugId',
            foreignField: '_id',
            as: 'plug',
          },
        },
        {
          $lookup: {
            from: 'services',
            let: {
              serviceName: {
                $arrayElemAt: ['$plug.actions.serviceName', '$stepIdx'],
              },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$name', '$$serviceName'],
                  },
                },
              },
            ],
            as: 'service',
          },
        },
        /*
        {
          $lookup: {
            from: 'services',
            let: {
              serviceName: {
                $cond: {
                  if: { $eq: ['$stepIdx', 0] },
                  then: '$plug.event.serviceName',
                  else: {
                    $arrayElemAt: [
                      '$plug.actions.serviceName',
                      { $substract: ['$stepIdx', 1] },
                    ],
                  },
                },
              },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$name', '$$serviceName'],
                  },
                },
              },
            ],
            as: 'service',
          },
        },
        */
        /*
        {
          $lookup: {
            from: 'services',
            let: {
              serviceName: {
                $arrayElemAt: ['$plug.actions.serviceName', '$stepIdx'],
              },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$name', '$$serviceName'],
                  },
                },
              },
            ],
            as: 'nextService',
          },
        },
        */
      ])
      .exec();

    return this.format(toFormat) as RunWithId & {
      plug: Plug;
      service: Service;
      //nextService: Service;
    };
  }

  async update(id: string, run: Run): Promise<void> {
    await this.runModel.findByIdAndUpdate(id, run).exec();
  }

  async delete(id: string): Promise<void> {
    await this.runModel.findByIdAndDelete(id).exec();
  }
}
