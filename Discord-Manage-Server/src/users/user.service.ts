import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Friend } from '../friends/friend.entity';
import * as bcrypt from 'bcryptjs';
import { Client } from '@elastic/elasticsearch';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
  ) {
    this.esClient = new Client({
      node: process.env.ELASTIC_NODE,
      auth: { apiKey: process.env.ELASTIC_API_KEY! },
    });
  }

  private readonly esClient: Client;

  async getUsers() {
    const result = await this.esClient.search({
      index: 'users',
      body: {
        query: {
          match_all: {},
        },
      },
    });

    const users = result.hits.hits.map((hit: any) => hit._source);
    return users;
  }

  async createUser(data: UserDto) {
    const { username, password, email, avatar } = data;

    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      username,
      password: hashPassword,
      email,
      avatar: avatar || 'assets/discord-logo.png',
    });

    await this.userRepository.save(newUser);

    await this.esClient.index({
      index: 'users',
      id: newUser.id,
      body: {
        username: newUser.username,
        password: newUser.password,
        email: newUser.email,
        status: newUser.status,
        avatar: newUser.avatar,
      },
    });

    return newUser;
  }

  async searchUser(query: string) {
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
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    const existingUser = await this.userRepository.findOne({
      where: [{ username: data.username }, { email: data.email }],
    });

    if (existingUser && existingUser.id !== user.id) {
      throw new Error('Username or email already exists');
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await this.userRepository.update({ username }, data);

    await this.esClient.update({
      index: 'users',
      id: user.id,
      body: {
        doc: {
          username: data.username,
          email: data.email,
          status: data.status,
          avatar: data.avatar,
        },
      },
    });

    return { message: 'User updated successfully' };
  }

  async deleteUser(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    const friendshipsAsUser = await this.friendRepository.find({
      where: { user_id: user.id },
    });
    const friendshipsAsFriend = await this.friendRepository.find({
      where: { friend_id: user.id },
    });

    const friendshipIds = [
      ...friendshipsAsUser.map((f) => f.id),
      ...friendshipsAsFriend.map((f) => f.id),
    ];

    if (friendshipIds.length > 0) {
      await this.friendRepository.delete(friendshipIds);
      await Promise.all(
        friendshipIds.map((id) =>
          this.esClient
            .delete({
              index: 'friends',
              id,
            })
            .catch((err) =>
              console.error(
                `Failed to delete friend ${id} from Elasticsearch: ${err}`,
              ),
            ),
        ),
      );
    }

    await this.userRepository.delete({ username });

    await this.esClient.delete({
      index: 'users',
      id: user.id,
    });

    return { message: 'User deleted successfully' };
  }
}
