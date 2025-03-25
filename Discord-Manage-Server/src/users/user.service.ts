import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Client } from '@elastic/elasticsearch';
import { UserDto } from './user.dto';

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
    const existingUser = await this.userRepository.findOne({
      where: [{ username: data.username }, { email: data.email }],
    });
    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    const user = this.userRepository.create({
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
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
    if (hits.length === 0) {
      throw new Error('No users found');
    }

    return hits;
  }

  async updateUser(username: string, data: Partial<UserDto>) {
    const user = await this.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    await this.userRepository.update(user.id, {
      ...data,
      updated_at: new Date(),
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

  async deleteUser(username: string) {
    const user = await this.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    await this.userRepository.delete(user.id);

    await this.esClient.delete({
      index: 'users',
      id: user.id,
    });

    return { message: 'User deleted successfully' };
  }

  async getAllUsers() {
    const result = await this.esClient.search({
      index: 'users',
      body: {
        query: {
          match_all: {},
        },
      },
    });

    return result.hits.hits.map((hit: any) => hit._source);
  }
}
