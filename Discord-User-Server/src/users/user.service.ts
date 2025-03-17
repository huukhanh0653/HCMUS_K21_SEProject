import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
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
    const { username, password, email } = data;

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
    });

    await this.userRepository.save(newUser);

    await this.esClient.index({
      index: 'users',
      id: newUser.id,
      body: {
        username: newUser.username,
        email: newUser.email,
        status: newUser.status,
        friends: newUser.friends,
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
          friends: data.friends,
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

    await this.userRepository.delete({ username });
    await this.esClient.delete({
      index: 'users',
      id: user.id,
    });

    return { message: 'User deleted successfully' };
  }

  async addFriend(username: string, friendUsername: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    const friend = await this.userRepository.findOne({
      where: { username: friendUsername },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!friend) {
      throw new Error('Friend not found');
    }

    if (user.id === friend.id) {
      throw new Error('Cannot add self as a friend');
    }

    if (user.friends.includes(friendUsername)) {
      throw new Error('Already friends');
    }

    user.friends.push(friendUsername);
    await this.userRepository.save(user);

    await this.esClient.update({
      index: 'users',
      id: user.id,
      body: {
        doc: {
          friends: user.friends,
        },
      },
    });

    return { message: `Added ${friendUsername} to ${username}'s friends list` };
  }

  async removeFriend(username: string, friendUsername: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.friends.includes(friendUsername)) {
      throw new Error('Friend not found in your list');
    }

    user.friends = user.friends.filter((friend) => friend !== friendUsername);
    await this.userRepository.save(user);

    await this.esClient.update({
      index: 'users',
      id: user.id,
      body: {
        doc: {
          friends: user.friends,
        },
      },
    });

    return {
      message: `Removed ${friendUsername} from ${username}'s friends list`,
    };
  }
}
