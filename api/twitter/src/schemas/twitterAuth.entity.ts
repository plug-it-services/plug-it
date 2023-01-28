import { Entity, Column, Index, PrimaryColumn, CreateDateColumn } from "typeorm";

@Entity()
export class TwitterAuthEntity {
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
  codeChallenge: string;

  @Column({ nullable: true })
  accessToken?: string;

  @Column({ nullable: true })
  refreshToken?: string;
}
