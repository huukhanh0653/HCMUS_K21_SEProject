import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  username: string;

  @Column({ length: 100 })
  password: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ default: true })
  status: boolean;

  @Column({ default: 'assets/discord-logo.png' })
  avatar: string;
}
