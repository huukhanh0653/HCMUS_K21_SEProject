import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from './friend.entity';
import { User } from '../users/user.entity';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.esClient = new Client({
      node: process.env.ELASTIC_NODE,
      auth: { apiKey: process.env.ELASTIC_API_KEY! },
    });
  }

  private readonly esClient: Client;

  async addFriend(username: string, friendUsername: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    const friend = await this.userRepository.findOne({
      where: { username: friendUsername },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!friend) {
      throw new Error('User wanted to make friend not found');
    }

    if (user.id === friend.id) {
      throw new Error('Cannot add self as a friend');
    }

    const existingFriendship = await this.friendRepository.findOne({
      where: { user_id: user.id, friend_id: friend.id },
    });

    if (existingFriendship) {
      throw new Error('Already friends');
    }

    const newFriendship = this.friendRepository.create({
      user_id: user.id,
      friend_id: friend.id,
    });

    await this.friendRepository.save(newFriendship);

    await this.esClient.index({
      index: 'friends',
      id: newFriendship.id,
      body: {
        user_username: user.username,
        friend_username: friend.username,
      },
    });

    return { message: `Added ${friendUsername} to ${username}'s friends list` };
  }

  async removeFriend(username: string, friendUsername: string) {
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

    const friendship = await this.friendRepository.findOne({
      where: { user_id: user.id, friend_id: friend.id },
    });

    if (!friendship) {
      throw new Error('Friend not found in your list');
    }

    await this.friendRepository.delete(friendship.id);

    await this.esClient.delete({
      index: 'friends',
      id: friendship.id,
    });

    return {
      message: `Removed ${friendUsername} from ${username}'s friends list`,
    };
  }

  async getFriends(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    const result = await this.esClient.search({
      index: 'friends',
      body: {
        query: {
          term: { user_username: user.username },
        },
      },
    });

    const friends = result.hits.hits.map(
      (hit: any) => hit._source.friend_username,
    );
    return friends;
  }

  async searchFriend(username: string, query: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    const result = await this.esClient.search({
      index: 'friends',
      body: {
        query: {
          bool: {
            filter: [{ term: { user_username: user.username } }],
            must: [
              {
                query_string: {
                  query: `*${query}*`,
                  fields: ['friend_username'],
                },
              },
            ],
          },
        },
      },
    });

    const friends = result.hits.hits.map(
      (hit: any) => hit._source.friend_username,
    );
    if (friends.length === 0) {
      throw new Error('No friends found matching the query');
    }

    return friends;
  }
}
