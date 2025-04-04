import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Server } from '../servers/server.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  server_id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  color: string;

  @Column({ type: 'int', nullable: true })
  position: number;

  @Column({ type: 'boolean', nullable: true })
  is_default: boolean;

  @ManyToOne(() => Server)
  @JoinColumn({ name: 'server_id' })
  server: Server;
}
