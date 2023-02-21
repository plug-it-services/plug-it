import { Entity, Column, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class OutlookAuthEntity {
  @Column({ unique: true })
  @Index({ unique: true })
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  @Index({ unique: true })
  userId: number;

  @Column({ type: 'bigint', nullable: true })
  expiresAt: number;

  @Column()
  redirectUrl: string;

  @Column()
  codeChallenge: string;

  @Column({ nullable: true })
  accessToken?: string;

  @Column({ nullable: true })
  refreshToken?: string;
}
