import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import UserConnection, {
  UserConnectionDocument,
} from '../schemas/usersConnection.schema';
import { Model } from 'mongoose';

@Injectable()
export default class UsersConnectionsService {
  constructor(
    @InjectModel(UserConnection.name)
    private userConnectionModel: Model<UserConnectionDocument>,
  ) {}

  async connectionReferenceExists(
    userId: number,
    serviceName: string,
  ): Promise<boolean> {
    const userConnection = await this.userConnectionModel.findOne({
      userId,
      service: serviceName,
    });

    return !!userConnection;
  }

  async create(userId: number, serviceName: string): Promise<UserConnection> {
    const createdUserConnection = await this.userConnectionModel.create({
      userId,
      connected: true,
      service: serviceName,
    });

    return createdUserConnection.save();
  }

  async setConnected(
    userId: number,
    serviceName: string,
    connected: boolean,
  ): Promise<UserConnection> {
    const updatedUserConnection =
      await this.userConnectionModel.findOneAndUpdate(
        { userId, service: serviceName },
        { connected },
      );

    return updatedUserConnection.save();
  }
}
