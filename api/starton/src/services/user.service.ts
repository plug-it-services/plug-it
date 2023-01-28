import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getUserById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ id });
  }

  async create(id: number, apiKey: string): Promise<UserEntity> {
    return this.userRepository.save({
      id,
      apiKey,
    });
  }

  async delete(userId: number) {
    await this.userRepository.delete({ id: userId });
  }
}
