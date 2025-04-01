import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from './friend.entity';
import { UserService } from '../users/user.service';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
    private userService: UserService,
  ) {
    this.esClient = new Client({
      node: process.env.ELASTIC_NODE,
      auth: { apiKey: process.env.ELASTIC_API_KEY! },
    });
  }

  private readonly esClient: Client;

  async addFriend(username: string, friendUsername: string) {
    const user = await this.userService.getUserByUsername(username);
    const friend = await this.userService.getUserByUsername(friendUsername);

    if (!user) throw new Error('User not found');
    if (!friend) throw new Error('User wanted to make friend not found');
    if (user.id === friend.id) throw new Error('Cannot add self as a friend');

    const existingFriendship = await this.friendRepository.findOne({
      where: { user_id: user.id, friend_id: friend.id },
    });

    if (existingFriendship) throw new Error('Already friends');

    const newFriendship = this.friendRepository.create({
      user_id: user.id,
      friend_id: friend.id,
      added_at: new Date(), // Thêm added_at
    });

    await this.friendRepository.save(newFriendship);

    await this.esClient.index({
      index: 'friends',
      id: newFriendship.id,
      body: {
        user_username: user.username,
        friend_username: friend.username,
        friend_status: friend.status,
        friend_profile_pic: friend.profile_pic,
        added_at: newFriendship.added_at,
      },
    });

    return { message: `Added ${friendUsername} to ${username}'s friends list` };
  }

  async removeFriend(username: string, friendUsername: string) {
    const user = await this.userService.getUserByUsername(username);
    const friend = await this.userService.getUserByUsername(friendUsername);

    if (!user) throw new Error('User not found');
    if (!friend) throw new Error('Friend not found');

    const friendship = await this.friendRepository.findOne({
      where: { user_id: user.id, friend_id: friend.id },
    });

    if (!friendship) throw new Error('Friend not found in your list');

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
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const friendships = await this.friendRepository.find({
      where: { user_id: user.id },
      relations: ['friend'], // Tải thông tin của friend
    });

    for (const friendship of friendships) {
      await this.esClient.index({
        index: 'friends',
        id: friendship.id,
        body: {
          user_username: user.username,
          friend_username: friendship.friend.username,
          friend_status: friendship.friend.status,
          friend_profile_pic: friendship.friend.profile_pic,
          added_at: friendship.added_at,
        },
      });
    }

    const result = await this.esClient.search({
      index: 'friends',
      body: {
        query: {
          term: { user_username: user.username },
        },
      },
    });

    const friends = result.hits.hits.map((hit: any) => ({
      friend_username: hit._source.friend_username,
      friend_status: hit._source.friend_status,
      friend_profile_pic: hit._source.friend_profile_pic,
      added_at: hit._source.added_at,
    }));

    return friends;
  }

  async searchFriend(username: string, query: string) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new Error('User not found');

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

    const friends = result.hits.hits.map((hit: any) => ({
      friend_username: hit._source.friend_username,
      friend_status: hit._source.friend_status,
      friend_profile_pic: hit._source.friend_profile_pic,
      added_at: hit._source.added_at,
    }));

    if (friends.length === 0)
      throw new Error('No friends found matching the query');

    return friends;
  }
}
