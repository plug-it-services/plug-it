import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ nullable: true })
  crsfToken?: string;

  @Column({ type: 'enum', enum: ['sso', 'basic'] })
  authType: AuthType;
}
