import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Server } from '../servers/server.entity';
import { User } from '../users/user.entity';

@Entity('server_members')
export class ServerMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  server_id: string;

  @Column()
  user_id: string;

  @Column({ enum: ['admin', 'member'], default: 'member' })
  role: string;

  @ManyToOne(() => Server)
  @JoinColumn({ name: 'server_id' })
  server: Server;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
