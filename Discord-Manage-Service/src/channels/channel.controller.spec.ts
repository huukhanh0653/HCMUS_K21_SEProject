import { Test, TestingModule } from '@nestjs/testing';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

describe('ChannelController', () => {
  let channelController: ChannelController;
  let channelService: ChannelService;

  const mockChannelService = {
    createChannel: jest.fn(),
    getChannels: jest.fn(),
    getChannelsByServer: jest.fn(),
    updateChannel: jest.fn(),
    deleteChannel: jest.fn(),
  };

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelController],
      providers: [
        {
          provide: ChannelService,
          useValue: mockChannelService,
        },
      ],
    }).compile();

    channelController = module.get<ChannelController>(ChannelController);
    channelService = module.get<ChannelService>(ChannelService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createChannel', () => {
    it('should create a channel and return status 201', async () => {
      const mockChannel = { id: '1', name: 'General' };
      mockChannelService.createChannel.mockResolvedValue(mockChannel);

      const res = mockResponse();
      const result = await channelController.createChannel(
        'server1',
        'user1',
        { name: 'General' },
        res,
      );

      expect(mockChannelService.createChannel).toHaveBeenCalledWith(
        'server1',
        { name: 'General' },
        'user1',
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith(mockChannel);
    });

    it('should return status 400 if an error occurs', async () => {
      mockChannelService.createChannel.mockRejectedValue(
        new Error('Create channel error'),
      );

      const res = mockResponse();
      await channelController.createChannel(
        'server1',
        'user1',
        { name: 'General' },
        res,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Create channel error',
      });
    });
  });

  describe('getChannels', () => {
    it('should return a channel and status 200', async () => {
      const mockChannel = { id: '1', name: 'General' };
      mockChannelService.getChannels.mockResolvedValue(mockChannel);

      const res = mockResponse();
      await channelController.getChannels('server1', 'General', 'user1', res);

      expect(mockChannelService.getChannels).toHaveBeenCalledWith(
        'user1',
        'server1',
        'General',
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(mockChannel);
    });

    it('should return status 404 if channel not found', async () => {
      mockChannelService.getChannels.mockRejectedValue(
        new Error('Channel not found'),
      );

      const res = mockResponse();
      await channelController.getChannels('server1', 'General', 'user1', res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Channel not found',
      });
    });
  });

  describe('getChannelsByServer', () => {
    it('should return channels by server and status 200', async () => {
      const mockChannels = [{ id: '1', name: 'General' }];
      mockChannelService.getChannelsByServer.mockResolvedValue(mockChannels);

      const res = mockResponse();
      await channelController.getChannelsByServer('server1', 'user1', res);

      expect(mockChannelService.getChannelsByServer).toHaveBeenCalledWith(
        'server1',
        'user1',
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(mockChannels);
    });

    it('should return status 400 if an error occurs', async () => {
      mockChannelService.getChannelsByServer.mockRejectedValue(
        new Error('Get channels error'),
      );

      const res = mockResponse();
      await channelController.getChannelsByServer('server1', 'user1', res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Get channels error',
      });
    });
  });

  describe('updateChannel', () => {
    it('should update a channel and return status 200', async () => {
      const mockUpdatedChannel = { id: '1', name: 'Updated Channel' };
      mockChannelService.updateChannel.mockResolvedValue(mockUpdatedChannel);

      const res = mockResponse();
      await channelController.updateChannel(
        'channel1',
        'user1',
        { name: 'Updated Channel' },
        res,
      );

      expect(mockChannelService.updateChannel).toHaveBeenCalledWith(
        'channel1',
        { name: 'Updated Channel' },
        'user1',
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedChannel);
    });

    it('should return status 400 if an error occurs', async () => {
      mockChannelService.updateChannel.mockRejectedValue(
        new Error('Update channel error'),
      );

      const res = mockResponse();
      await channelController.updateChannel(
        'channel1',
        'user1',
        { name: 'Updated Channel' },
        res,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Update channel error',
      });
    });
  });

  describe('deleteChannel', () => {
    it('should delete a channel and return status 200', async () => {
      const mockResult = { message: 'Channel deleted successfully' };
      mockChannelService.deleteChannel.mockResolvedValue(mockResult);

      const res = mockResponse();
      await channelController.deleteChannel('channel1', 'user1', res);

      expect(mockChannelService.deleteChannel).toHaveBeenCalledWith(
        'channel1',
        'user1',
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return status 400 if an error occurs', async () => {
      mockChannelService.deleteChannel.mockRejectedValue(
        new Error('Delete channel error'),
      );

      const res = mockResponse();
      await channelController.deleteChannel('channel1', 'user1', res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Delete channel error',
      });
    });
  });
});