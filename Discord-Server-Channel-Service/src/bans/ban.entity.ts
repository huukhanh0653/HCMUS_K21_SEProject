import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('bans')
export class Ban {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  server_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @CreateDateColumn()
  banned_at: Date;
}
