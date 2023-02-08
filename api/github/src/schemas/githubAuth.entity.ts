import { Entity, Column, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class GithubAuthEntity {
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
  accessToken?: string;
}
