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

  async login(email: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(email);
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async basicSignup(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<void> {
    if (await this.userExists(email))
      throw new HttpException('User already exists', 422);
    const hashPassword = await hash(password, 10);
    await this.usersService.create(
      email,
      firstName,
      lastName,
      'basic',
      hashPassword,
    );
  }

  async ssoLoginOrSignup(
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<any> {
    let user = await this.usersService.findOneByEmail(email);
    if (!user) {
      user = await this.usersService.create(email, firstName, lastName, 'sso');
    } else {
      return {
        ...user,
        access_token: this.jwtService.sign({ sub: user.id }),
      };
    }
  }

  private async userExists(email: string): Promise<boolean> {
    return (await this.usersService.findOneByEmail(email)) !== null;
  }
}
