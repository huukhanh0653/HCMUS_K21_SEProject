"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const channel_entity_1 = require("./channel.entity");
const server_entity_1 = require("../servers/server.entity");
const user_service_1 = require("../users/user.service");
const channel_member_service_1 = require("../channel_members/channel_member.service");
const elasticsearch_1 = require("@elastic/elasticsearch");
const microservices_1 = require("@nestjs/microservices");
const channel_dto_1 = require("./channel.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let ChannelService = class ChannelService {
    channelRepository;
    serverRepository;
    userService;
    channelMemberService;
    constructor(channelRepository, serverRepository, userService, channelMemberService) {
        this.channelRepository = channelRepository;
        this.serverRepository = serverRepository;
        this.userService = userService;
        this.channelMemberService = channelMemberService;
        this.esClient = new elasticsearch_1.Client({
            node: process.env.ELASTIC_NODE,
            auth: { apiKey: process.env.ELASTIC_API_KEY },
        });
    }
    esClient;
    async createChannel(serverId, data, username) {
        const channelDto = (0, class_transformer_1.plainToClass)(channel_dto_1.ChannelDto, data);
        const errors = await (0, class_validator_1.validate)(channelDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(`Validation failed: ${errors
                .map((e) => e.constraints
                ? Object.values(e.constraints).join(', ')
                : 'Unknown error')
                .join('; ')}`);
        }
        const user = await this.userService.getUserByUsername(username);
        const server = await this.serverRepository.findOne({
            where: { id: serverId },
        });
        if (!server)
            throw new common_1.NotFoundException('Server not found');
        if (server.owner_id !== user.id)
            throw new common_1.ForbiddenException('Only the owner can create channels');
        const existingChannel = await this.channelRepository.findOne({
            where: { server_id: serverId, name: data.name },
        });
        if (existingChannel)
            throw new common_1.BadRequestException('Channel with this name already exists in the server');
        const channel = this.channelRepository.create({
            server_id: serverId,
            name: data.name,
            type: data.type || 'text',
            is_private: data.is_private || false,
        });
        await this.channelRepository.save(channel);
        await this.channelMemberService.addMember(channel.id, username, {
            username: user.username,
        });
        await this.esClient.index({
            index: 'channels',
            id: channel.id,
            body: {
                server_id: serverId,
                server_name: server.name,
                name: channel.name,
                type: channel.type,
                created_at: channel.created_at,
                is_private: channel.is_private,
                server_pic: server.server_pic,
            },
        });
        return channel;
    }
    async updateChannel(channelId, data, username) {
        const channelDto = (0, class_transformer_1.plainToClass)(channel_dto_1.ChannelDto, data);
        const errors = await (0, class_validator_1.validate)(channelDto, { skipMissingProperties: true });
        if (errors.length > 0) {
            throw new common_1.BadRequestException(`Validation failed: ${errors
                .map((e) => e.constraints
                ? Object.values(e.constraints).join(', ')
                : 'Unknown error')
                .join('; ')}`);
        }
        const user = await this.userService.getUserByUsername(username);
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['server'],
        });
        if (!channel)
            throw new common_1.NotFoundException('Channel not found');
        if (channel.server.owner_id !== user.id)
            throw new common_1.ForbiddenException('Only the owner can update the channel');
        const updatedData = {
            name: data.name || channel.name,
            type: data.type || channel.type,
            is_private: data.is_private !== undefined ? data.is_private : channel.is_private,
        };
        await this.channelRepository.update(channelId, updatedData);
        await this.esClient.update({
            index: 'channels',
            id: channelId,
            body: { doc: updatedData },
        });
        return { message: 'Channel updated successfully' };
    }
    async getChannels(username, serverId, query) {
        const user = await this.userService.getUserByUsername(username);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const server = await this.serverRepository.findOne({
            where: { id: serverId },
        });
        if (!server)
            throw new common_1.NotFoundException('Server not found');
        const result = await this.esClient.search({
            index: 'channels',
            body: {
                query: {
                    bool: {
                        filter: [{ term: { server_id: server.id } }],
                        must: [{ match_phrase_prefix: { name: query } }],
                    },
                },
            },
        });
        const channels = result.hits.hits.map((hit) => hit._source);
        if (channels.length === 0)
            throw new common_1.NotFoundException('No channels found');
        return channels;
    }
    async getChannelsByServer(serverId, username) {
        const user = await this.userService.getUserByUsername(username);
        const server = await this.serverRepository.findOne({
            where: { id: serverId },
        });
        if (!server)
            throw new common_1.NotFoundException('Server not found');
        const result = await this.esClient.search({
            index: 'channels',
            body: { query: { term: { server_id: server.id } } },
        });
        return result.hits.hits.map((hit) => hit._source);
    }
    async deleteChannel(channelId, username) {
        const user = await this.userService.getUserByUsername(username);
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['server'],
        });
        if (!channel)
            throw new common_1.NotFoundException('Channel not found');
        if (channel.server.owner_id !== user.id)
            throw new common_1.ForbiddenException('Only the owner can delete the channel');
        await this.channelRepository.delete(channelId);
        await this.esClient.delete({ index: 'channels', id: channelId });
        return { message: 'Channel deleted successfully' };
    }
    async createChannelGrpc(data) {
        const channel = await this.createChannel(data.server_id, data, data.username);
        return this.mapChannelToResponse(channel);
    }
    async updateChannelGrpc(data) {
        const result = await this.updateChannel(data.channel_id, data, data.username);
        return { message: result.message };
    }
    async getChannelsGrpc(data) {
        const channels = await this.getChannels(data.username, data.server_id, data.query);
        return {
            channels: channels.map((channel) => this.mapChannelToResponse(channel)),
        };
    }
    async getChannelsByServerGrpc(data) {
        const channels = await this.getChannelsByServer(data.server_id, data.username);
        return {
            channels: channels.map((channel) => this.mapChannelToResponse(channel)),
        };
    }
    async deleteChannelGrpc(data) {
        const result = await this.deleteChannel(data.channel_id, data.username);
        return { message: result.message };
    }
    mapChannelToResponse(channel) {
        return {
            id: channel.id,
            server_id: channel.server_id,
            name: channel.name,
            type: channel.type || '',
            created_at: channel.created_at.toISOString(),
            is_private: channel.is_private || false,
        };
    }
};
exports.ChannelService = ChannelService;
__decorate([
    (0, microservices_1.GrpcMethod)('ChannelService', 'CreateChannel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelService.prototype, "createChannelGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ChannelService', 'UpdateChannel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelService.prototype, "updateChannelGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ChannelService', 'GetChannels'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelService.prototype, "getChannelsGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ChannelService', 'GetChannelsByServer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelService.prototype, "getChannelsByServerGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ChannelService', 'DeleteChannel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelService.prototype, "deleteChannelGrpc", null);
exports.ChannelService = ChannelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel)),
    __param(1, (0, typeorm_1.InjectRepository)(server_entity_1.Server)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        user_service_1.UserService,
        channel_member_service_1.ChannelMemberService])
], ChannelService);
//# sourceMappingURL=channel.service.js.map