import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthType, User } from './user.entity';
import { CrsfToken } from './crsfToken.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(CrsfToken)
    private crsfTokenRepository: Repository<CrsfToken>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async removeCrsfToken(userId: number, crsfToken: string) {
    const user = await this.findOneById(userId);
    await this.crsfTokenRepository.delete({
      user: user,
      token: crsfToken,
    });
  }

  private async removeOldCrsfTokens(userId: number) {
    const user = await this.findOneById(userId);
    const now = new Date();
    const maxAge = 1000 * 60 * 60 * 8; // 8 hours
    const crsfTokens = user.crsfTokens?.filter((el) => {
      const diff = now.getTime() - el.createdAt.getTime();
      return diff > maxAge;
    });
    const promises = crsfTokens?.map((el) => {
      return this.crsfTokenRepository.delete(el.token);
    });
    await Promise.all(promises);
  }

  async saveCrsfToken(id: number, crsfToken: string): Promise<void> {
    await this.removeOldCrsfTokens(id);
    const user = await this.findOneById(id);
    if (!user.crsfTokens?.find((el) => el.token === crsfToken)) {
      await this.crsfTokenRepository.save({
        token: crsfToken,
        user,
      });
    }
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email: email });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async create(
    email: string,
    firstname: string,
    lastname: string,
    authType: AuthType,
    password?: string,
  ): Promise<User> {
    return this.usersRepository.save({
      email,
      password,
      firstname,
      lastname,
      authType,
    });
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
