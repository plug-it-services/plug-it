import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email: email });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async create(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
  ): Promise<User> {
    return this.usersRepository.save({ email, password, firstname, lastname });
  }

  async update(
    id: string,
    email: string,
    password: string,
    firstname: string,
    lastname: string,
  ): Promise<void> {
    await this.usersRepository.update(id, {
      email,
      password,
      firstname,
      lastname,
    });
  }
}
