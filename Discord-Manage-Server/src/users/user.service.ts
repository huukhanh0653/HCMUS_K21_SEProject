import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { Client } from '@elastic/elasticsearch';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    this.esClient = new Client({
      node: process.env.ELASTIC_NODE,
      auth: { apiKey: process.env.ELASTIC_API_KEY! },
    });
  }

  private readonly esClient: Client;

  async createUser(data: UserDto) {
    const { username, password, email, status } = data;

    const existingUser = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      username,
      password: hashPassword,
      email,
      status,
    });

    await newUser.save();

    await this.esClient.index({
      index: 'users',
      id: newUser.id,
      body: {
        username: newUser.username,
        email: newUser.email,
        status: newUser.status,
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
}
