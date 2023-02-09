import { Entity, Column, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class WebHookEntity {
  @Column({ unique: true })
  @Index({ unique: true })
  @PrimaryColumn()
  uuid: string;

  @Column({ unique: true })
  @Index({ unique: true })
  uid: number;
}
