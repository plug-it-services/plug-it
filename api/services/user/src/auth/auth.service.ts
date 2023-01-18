import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      return null;
    }
    if (await compare(password, user.password)) {
      const { password, ...result } = user; // eslint-disable-line @typescript-eslint/no-unused-vars
      return result;
    }
    return null;
  }

  async login(email: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(email: string, password: string): Promise<void> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      throw new HttpException('User already exists', 422);
    }
    const hashPassword = await hash(password, 10);
    await this.usersService.create(email, hashPassword);
  }
}
