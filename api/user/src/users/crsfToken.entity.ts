import {
  Entity,
  Index,
  ManyToOne,
  CreateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@Index(['user', 'token'], { unique: true })
export class CrsfToken {
  @ManyToOne(() => User, (user) => user.crsfTokens)
  user: User;

  @PrimaryColumn()
  token: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;
}
