import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Client } from '@elastic/elasticsearch';
import { GrpcMethod } from '@nestjs/microservices';
import { UserDto } from './user.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.esClient = new Client({
      node: process.env.ELASTIC_NODE,
      auth: { apiKey: process.env.ELASTIC_API_KEY! },
    });
  }

  private readonly esClient: Client;

  async createUser(data: UserDto) {
    const userDto = plainToClass(UserDto, data);
    const errors = await validate(userDto);
    if (errors.length > 0) {
      throw new Error(
        `Validation failed: ${errors
          .map((e) =>
            e.constraints
              ? Object.values(e.constraints).join(', ')
              : 'Unknown error',
          )
          .join('; ')}`,
      );
    }

    const existingUser = await this.userRepository.findOne({
      where: [{ username: data.username }, { email: data.email }],
    });
    if (existingUser) throw new Error('Username or email already exists');

    const user = this.userRepository.create({
      ...data,
    });

    await this.userRepository.save(user);

    await this.esClient.index({
      index: 'users',
      id: user.id,
      body: {
        username: user.username,
        email: user.email,
        profile_pic: user.profile_pic,
        status: user.status,
        is_admin: user.is_admin,
      },
    });

    return user;
  }

  async updateUser(username: string, data: Partial<UserDto>) {
    const userDto = plainToClass(UserDto, data);
    const errors = await validate(userDto, { skipMissingProperties: true });
    if (errors.length > 0) {
      throw new Error(
        `Validation failed: ${errors
          .map((e) =>
            e.constraints
              ? Object.values(e.constraints).join(', ')
              : 'Unknown error',
          )
          .join('; ')}`,
      );
    }

    const user = await this.getUserByUsername(username);
    await this.userRepository.update(user.id, {
      ...data,
    });

    await this.esClient.update({
      index: 'users',
      id: user.id,
      body: {
        doc: {
          username: data.username || user.username,
          email: data.email || user.email,
          profile_pic: data.profile_pic || user.profile_pic,
          status: data.status || user.status,
        },
      },
    });

    return { message: 'User updated successfully' };
  }

  // Các phương thức khác giữ nguyên từ trước
  async getUserByUsername(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) throw new Error('User not found');
    return user;
  }

  async searchUsers(query: string) {
    const result = await this.esClient.search({
      index: 'users',
      body: {
        query: {
          bool: {
            should: [
              { query_string: { query: `*${query}*`, fields: ['username'] } },
              { query_string: { query: `*${query}*`, fields: ['email'] } },
            ],
            minimum_should_match: 1,
          },
        },
      },
    });

    const hits = result.hits.hits;
    if (hits.length === 0) throw new Error('No users found');
    return hits.map((hit: any) => hit._source);
  }

  async deleteUser(username: string) {
    const user = await this.getUserByUsername(username);
    await this.userRepository.delete(user.id);
    await this.esClient.delete({ index: 'users', id: user.id });
    return { message: 'User deleted successfully' };
  }

  async getAllUsers() {
    const result = await this.esClient.search({
      index: 'users',
      body: { query: { match_all: {} } },
    });
    return result.hits.hits.map((hit: any) => hit._source);
  }

  @GrpcMethod('UserService', 'CreateUser')
  async createUserGrpc(data: any) {
    const user = await this.createUser(data);
    return this.mapUserToResponse(user);
  }

  @GrpcMethod('UserService', 'UpdateUser')
  async updateUserGrpc(data: any) {
    const result = await this.updateUser(data.username, data);
    return { message: result.message };
  }

  // Các gRPC method khác giữ nguyên
  @GrpcMethod('UserService', 'GetUserByUsername')
  async getUserByUsernameGrpc(data: { username: string }) {
    const user = await this.getUserByUsername(data.username);
    return this.mapUserToResponse(user);
  }

  @GrpcMethod('UserService', 'SearchUsers')
  async searchUsersGrpc(data: { query: string }) {
    const users = await this.searchUsers(data.query);
    return { users: users.map((user: any) => this.mapUserToResponse(user)) };
  }

  @GrpcMethod('UserService', 'DeleteUser')
  async deleteUserGrpc(data: { username: string }) {
    const result = await this.deleteUser(data.username);
    return { message: result.message };
  }

  @GrpcMethod('UserService', 'GetAllUsers')
  async getAllUsersGrpc(data: any) {
    const users = await this.getAllUsers();
    return { users: users.map((user: any) => this.mapUserToResponse(user)) };
  }

  private mapUserToResponse(user: any) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      profile_pic: user.profile_pic || '',
      status: user.status || '',
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
      is_admin: user.is_admin || false,
    };
  }
}
