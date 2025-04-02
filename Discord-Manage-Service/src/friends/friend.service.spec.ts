import { Test, TestingModule } from '@nestjs/testing';
import { FriendService } from './friend.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Friend } from './friend.entity';
import { UserService } from '../users/user.service';
import { Repository } from 'typeorm';

describe('FriendService', () => {
  let service: FriendService;
  let friendRepository: Repository<Friend>;
  let userService: UserService;

  const mockFriendRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserService = {
    getUserByUsername: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendService,
        {
          provide: getRepositoryToken(Friend),
          useValue: mockFriendRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<FriendService>(FriendService);
    friendRepository = module.get<Repository<Friend>>(getRepositoryToken(Friend));
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addFriend', () => {
    it('should add a friend successfully', async () => {
      const username = 'user1';
      const friendUsername = 'user2';
      const user = { id: '1', username };
      const friend = { id: '2', username: friendUsername };

      mockUserService.getUserByUsername.mockResolvedValueOnce(user);
      mockUserService.getUserByUsername.mockResolvedValueOnce(friend);
      mockFriendRepository.findOne.mockResolvedValue(null);
      mockFriendRepository.save.mockResolvedValue({ id: '3', user_id: user.id, friend_id: friend.id });

      const result = await service.addFriend(username, friendUsername);

      expect(result).toEqual({ message: `Added ${friendUsername} to ${username}'s friends list` });
      expect(mockFriendRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if user not found', async () => {
      const username = 'user1';
      const friendUsername = 'user2';

      mockUserService.getUserByUsername.mockResolvedValueOnce(null);

      await expect(service.addFriend(username, friendUsername)).rejects.toThrow('User not found');
    });
  });

  // Add similar tests for removeFriend, getFriends, and searchFriend
});