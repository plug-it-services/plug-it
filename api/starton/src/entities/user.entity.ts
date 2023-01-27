import { Entity, Column, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @Column({ unique: true })
  @Index({ unique: true })
  @PrimaryColumn()
  id: number;

  @Column()
  apiKey: string;
}
