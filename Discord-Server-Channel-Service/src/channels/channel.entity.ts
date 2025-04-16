import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Server } from '../servers/server.entity';

@Entity('channels')
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  server_id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', default: 'text' })
  type: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'boolean', default: false })
  is_private: boolean;

  @ManyToOne(() => Server)
  @JoinColumn({ name: 'server_id' })
  server: Server;
}
