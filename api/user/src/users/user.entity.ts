import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CrsfToken } from './crsfToken.entity';

export type AuthType = 'sso' | 'basic';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @OneToMany(() => CrsfToken, (crsfToken) => crsfToken.user, {
    cascade: true,
    eager: true,
  })
  crsfTokens: CrsfToken[];

  @Column({ type: 'enum', enum: ['sso', 'basic'] })
  authType: AuthType;
}
