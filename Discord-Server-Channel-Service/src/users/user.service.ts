import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService) {}

  async getUser(userId: string): Promise<any> {
    try {
      console.log(`${process.env.USER_SERVICE_URL}/${userId}`);

      const response = await firstValueFrom(
        this.httpService.get(`${process.env.USER_SERVICE_URL}/${userId}`),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'User not found or API error',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getUsers(): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${process.env.USER_SERVICE_URL}`),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'No users found or API error',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
