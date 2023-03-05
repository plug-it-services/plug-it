import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CrsfToken } from './crsfToken.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service;
  const usersRepository = {};
  const crsfTokenRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: usersRepository,
        },
        {
          provide: getRepositoryToken(CrsfToken),
          useValue: crsfTokenRepository,
        },
        UsersService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should remove nothing if nothing is expired', async () => {
    const now = new Date();
    service.findOneById = jest.fn(() => [
      {
        crsfTokens: [
          {
            createdAt: now.getTime(),
            token: 'stonks',
          },
          {
            createdAt: now.getTime(),
            token: 'unstonks',
          },
        ],
      },
    ]);
    crsfTokenRepository['delete'] = jest.fn();

    await service['removeOldCrsfTokens'](1);
    expect(crsfTokenRepository['delete']).not.toHaveBeenCalled();
  });
});
