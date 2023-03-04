import { Entity, Column, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class DriveChangesWebhookEntity {
  @Column({ unique: true })
  @Index({ unique: true })
  @PrimaryColumn()
  id: string;

  @Column()
  userId: number;

  @Column({ unique: true })
  @Index({ unique: true })
  plugId: string;
}
