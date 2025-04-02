import { Test, TestingModule } from '@nestjs/testing';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

describe('FriendController', () => {
  let controller: FriendController;
  let service: FriendService;

  const mockFriendService = {
    addFriend: jest.fn(),
    removeFriend: jest.fn(),
    getFriends: jest.fn(),
    searchFriend: jest.fn(),
  };

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendController],
      providers: [
        {
          provide: FriendService,
          useValue: mockFriendService,
        },
      ],
    }).compile();

    controller = module.get<FriendController>(FriendController);
    service = module.get<FriendService>(FriendService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addFriend', () => {
    it('should add a friend and return the result', async () => {
      const username = 'user1';
      const friendUsername = 'user2';
      const res = mockResponse();
      const mockResult = { message: 'Friend added successfully' };

      mockFriendService.addFriend.mockResolvedValue(mockResult);

      await controller.addFriend(username, friendUsername, res);

      expect(mockFriendService.addFriend).toHaveBeenCalledWith(username, friendUsername);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return BAD_REQUEST on error', async () => {
      const username = 'user1';
      const friendUsername = 'user2';
      const res = mockResponse();

      mockFriendService.addFriend.mockRejectedValue(new Error('Error adding friend'));

      await controller.addFriend(username, friendUsername, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error adding friend' });
    });
  });

  describe('removeFriend', () => {
    it('should remove a friend and return the result', async () => {
      const username = 'user1';
      const friendUsername = 'user2';
      const res = mockResponse();
      const mockResult = { message: 'Friend removed successfully' };

      mockFriendService.removeFriend.mockResolvedValue(mockResult);

      await controller.removeFriend(username, friendUsername, res);

      expect(mockFriendService.removeFriend).toHaveBeenCalledWith(username, friendUsername);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return BAD_REQUEST on error', async () => {
      const username = 'user1';
      const friendUsername = 'user2';
      const res = mockResponse();

      mockFriendService.removeFriend.mockRejectedValue(new Error('Error removing friend'));

      await controller.removeFriend(username, friendUsername, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error removing friend' });
    });
  });

  describe('getFriends', () => {
    it('should return a list of friends', async () => {
      const username = 'user1';
      const res = mockResponse();
      const mockFriends = [{ username: 'friend1' }, { username: 'friend2' }];

      mockFriendService.getFriends.mockResolvedValue(mockFriends);

      await controller.getFriends(username, res);

      expect(mockFriendService.getFriends).toHaveBeenCalledWith(username);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(mockFriends);
    });

    it('should return BAD_REQUEST on error', async () => {
      const username = 'user1';
      const res = mockResponse();

      mockFriendService.getFriends.mockRejectedValue(new Error('Error fetching friends'));

      await controller.getFriends(username, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching friends' });
    });
  });

  describe('searchFriend', () => {
    it('should return a list of matching friends', async () => {
      const username = 'user1';
      const query = 'friend';
      const res = mockResponse();
      const mockFriends = [{ username: 'friend1' }, { username: 'friend2' }];

      mockFriendService.searchFriend.mockResolvedValue(mockFriends);

      await controller.searchFriend(username, query, res);

      expect(mockFriendService.searchFriend).toHaveBeenCalledWith(username, query);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(mockFriends);
    });

    it('should return BAD_REQUEST if query is missing', async () => {
      const username = 'user1';
      const query = '';
      const res = mockResponse();

      await controller.searchFriend(username, query, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith('Query parameter is required');
    });

    it('should return NOT_FOUND on error', async () => {
      const username = 'user1';
      const query = 'friend';
      const res = mockResponse();

      mockFriendService.searchFriend.mockRejectedValue(new Error('Error searching friends'));

      await controller.searchFriend(username, query, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error searching friends' });
    });
  });
});