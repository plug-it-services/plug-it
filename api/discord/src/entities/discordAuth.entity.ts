import { Entity, Column, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class DiscordAuthEntity {
  @Column({ unique: true })
  @Index({ unique: true })
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  @Index({ unique: true })
  userId: number;

  @Column({ unique: true, nullable: true })
  @Index({ unique: true })
  serverId?: string;

  @Column()
  redirectUrl: string;
}
