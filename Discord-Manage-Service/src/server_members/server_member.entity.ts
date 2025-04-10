import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Server } from '../servers/server.entity';
import { Role } from '../roles/role.entity';

@Entity('server_members')
export class ServerMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  server_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid', nullable: true })
  role_id: string;

  @CreateDateColumn()
  joined_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Server)
  @JoinColumn({ name: 'server_id' })
  server: Server;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
