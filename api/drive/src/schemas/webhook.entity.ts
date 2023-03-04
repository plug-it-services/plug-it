import { Entity, Column, Index, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['userId', 'plugId', 'eventId'])
export class WebHookEntity {
  @Column({ unique: true })
  @Index({ unique: true })
  @PrimaryColumn()
  uuid: string;

  @Column({ nullable: true })
  resourceId?: string;

  @Column()
  userId: number;

  @Column()
  plugId: string;

  @Column()
  eventId: string;
}
