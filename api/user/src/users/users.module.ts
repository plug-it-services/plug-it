import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { CrsfToken } from './crsfToken.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, CrsfToken])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
