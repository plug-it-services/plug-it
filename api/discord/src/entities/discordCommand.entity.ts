import { Entity, Column, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class DiscordCommandEntity {
  @Column({ unique: true })
  @Index({ unique: true })
  @PrimaryColumn()
  userId: number;

  @Column()
  command: string;

  @Column({ unique: true })
  @Index({ unique: true })
  plugId: string;

  @Column()
  @Index()
  serverId: string;
}
