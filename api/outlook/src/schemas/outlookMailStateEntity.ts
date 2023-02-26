import { Entity, Column, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class OutlookMailStateEntity {
  @Column({ unique: true })
  @Index({ unique: true })
  @PrimaryColumn()
  plugId: string;

  @Column()
  userId: number;

  @Column({type: 'bigint'})
  latestMailReceived: number;

  @Column({ nullable: true })
  mailBodyFilter: string;

  @Column({ nullable: true })
  mailSubjectFilter: string;

  @Column({ nullable: true })
  mailSenderFilter: string;

  @Column({ default: 'inbox' })
  inboxWatched: string;
}
