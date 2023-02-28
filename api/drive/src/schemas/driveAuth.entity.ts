import { Entity, Column, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class DriveAuthEntity {
  @Column({ unique: true })
  @Index({ unique: true })
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  @Index({ unique: true })
  userId: number;

  @Column()
  redirectUrl: string;

  @Column({ nullable: true })
  refreshToken?: string;
}
