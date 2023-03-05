import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { hash } from 'bcrypt';

describe('AuthService', () => {
  let service;
  const jwtService = {};
  const usersService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: UsersService,
          useValue: usersService,
        },
        AuthService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return null when no user found', () => {
      usersService['findOneByEmail'] = jest.fn(() => null);

      expect(
        service.validateUser('titi@toto.com', 'azerA@ty1234'),
      ).resolves.toBeNull();
    });

    it("should return null when password doesn't match", () => {
      usersService['findOneByEmail'] = jest.fn(async () => ({
        email: 'titi@toto.com',
        password: await hash('password', 10),
      }));

      expect(
        service.validateUser('titi@toto.com', 'wrongPassword'),
      ).resolves.toBeNull();
    });

    it('should return null when password match', () => {
      usersService['findOneByEmail'] = jest.fn(async () => ({
        email: 'titi@toto.com',
        password: await hash('azerA@ty1234', 10),
      }));

      expect(
        service.validateUser('titi@toto.com', 'azerA@ty1234'),
      ).resolves.toEqual({ email: 'titi@toto.com' });
    });
  });

  describe('userExists', () => {
    it('should return false when no user found', () => {
      usersService['findOneByEmail'] = jest.fn(() => null);

      expect(service.userExists('titi@toto.com')).resolves.toBeFalsy();
    });

    it('should return true when user found', () => {
      usersService['findOneByEmail'] = jest.fn(() => ({
        email: 'titi@toto.com',
      }));

      expect(service.userExists('titi@toto.com')).resolves.toBeTruthy();
    });
  });

  describe('login', () => {
    it('should return access_token', () => {
      usersService['findOneByEmail'] = jest.fn(() => ({
        email: 'titi@toto.com',
      }));
      jwtService['sign'] = jest.fn(() => 'token');

      expect(service.login('titi@toto.com')).resolves.toEqual({
        access_token: 'token',
      });
    });
  });

  describe('basicSignup', () => {
    it('should throw error when user already exists', () => {
      usersService['findOneByEmail'] = jest.fn(() => ({
        email: 'titi@toto.com',
      }));

      expect(
        service.basicSignup('titi@toto.com', 'james', 'bond'),
      ).rejects.toThrowError();
    });

    it('should create user ', async () => {
      usersService['create'] = jest.fn();
      usersService['findOneByEmail'] = jest.fn(() => null);

      await service.basicSignup('titi@toto.com', 'james', 'bond');
      expect(usersService['create']).toHaveBeenCalled();
    });
  });

  describe('ssoLoginOrSignup', () => {
    it('should create user ', async () => {
      usersService['create'] = jest.fn(() => ({
        id: 10,
      }));
      usersService['findOneByEmail'] = jest.fn(() => null);
      jwtService['sign'] = jest.fn(() => 'token');

      expect(
        service.ssoLoginOrSignup('titi@toto.com', 'james', 'bond'),
      ).resolves.toEqual({
        id: 10,
        access_token: 'token',
      });
    });

    it('should login user ', async () => {
      usersService['findOneByEmail'] = jest.fn(() => {
        id: 10;
      });
      jwtService['sign'] = jest.fn(() => 'token');

      expect(
        service.ssoLoginOrSignup('titi@toto.com', 'james', 'bond'),
      ).resolves.toEqual({
        id: 10,
        access_token: 'token',
      });
    });
  });
});
