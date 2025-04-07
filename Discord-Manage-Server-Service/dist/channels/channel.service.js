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
const channel_member_entity_1 = require("../channel_members/channel_member.entity");
const user_service_1 = require("../users/user.service");
const channel_member_service_1 = require("../channel_members/channel_member.service");
const elasticsearch_1 = require("@elastic/elasticsearch");
let ChannelService = class ChannelService {
    channelRepository;
    serverRepository;
    channelMemberRepository;
    userService;
    channelMemberService;
    constructor(channelRepository, serverRepository, channelMemberRepository, userService, channelMemberService) {
        this.channelRepository = channelRepository;
        this.serverRepository = serverRepository;
        this.channelMemberRepository = channelMemberRepository;
        this.userService = userService;
        this.channelMemberService = channelMemberService;
        this.esClient = new elasticsearch_1.Client({
            node: process.env.ELASTIC_NODE,
            auth: { apiKey: process.env.ELASTIC_API_KEY },
        });
    }
    esClient;
    async createChannel(serverId, data, username) {
        const user = await this.userService.getUserByUsername(username);
        if (!user)
            throw new Error('User not found');
        const server = await this.serverRepository.findOne({
            where: { id: serverId },
        });
        if (!server)
            throw new Error('Server not found');
        if (server.owner_id !== user.id)
            throw new Error('Only the owner can create channels');
        const existingChannel = await this.channelRepository.findOne({
            where: { server_id: serverId, name: data.name },
        });
        if (existingChannel)
            throw new Error('Channel with this name already exists in the server');
        const channel = this.channelRepository.create({
            server_id: serverId,
            name: data.name,
            type: data.type || 'text',
            created_at: new Date(),
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
    async getChannels(username, serverId, query) {
        const user = await this.userService.getUserByUsername(username);
        if (!user)
            throw new Error('User not found');
        const server = await this.serverRepository.findOne({
            where: { id: serverId },
        });
        if (!server)
            throw new Error('Server not found');
        const result = await this.esClient.search({
            index: 'channels',
            body: {
                query: {
                    bool: {
                        filter: [{ term: { server_id: server.id } }],
                        must: [
                            {
                                query_string: {
                                    query: `*${query}*`,
                                    fields: ['name'],
                                },
                            },
                        ],
                    },
                },
            },
        });
        const channels = result.hits.hits.map((hit) => hit._source);
        if (channels.length === 0) {
            throw new Error('No channels found');
        }
        return channels;
    }
    async getChannelsByServer(serverId, username) {
        const user = await this.userService.getUserByUsername(username);
        if (!user)
            throw new Error('User not found');
        const server = await this.serverRepository.findOne({
            where: { id: serverId },
        });
        if (!server)
            throw new Error('Server not found');
        const result = await this.esClient.search({
            index: 'channels',
            body: {
                query: {
                    term: { server_id: server.id },
                },
            },
        });
        return result.hits.hits.map((hit) => hit._source);
    }
    async updateChannel(channelId, data, username) {
        const user = await this.userService.getUserByUsername(username);
        if (!user)
            throw new Error('User not found');
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['server'],
        });
        if (!channel)
            throw new Error('Channel not found');
        if (channel.server.owner_id !== user.id)
            throw new Error('Only the owner can update the channel');
        const updatedData = {
            name: data.name || channel.name,
            type: data.type || channel.type,
            is_private: data.is_private !== undefined ? data.is_private : channel.is_private,
        };
        await this.channelRepository.update(channelId, updatedData);
        await this.esClient.update({
            index: 'channels',
            id: channelId,
            body: {
                doc: {
                    name: updatedData.name,
                    type: updatedData.type,
                    is_private: updatedData.is_private,
                },
            },
        });
        return { message: 'Channel updated successfully' };
    }
    async deleteChannel(channelId, username) {
        const user = await this.userService.getUserByUsername(username);
        if (!user)
            throw new Error('User not found');
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['server'],
        });
        if (!channel)
            throw new Error('Channel not found');
        if (channel.server.owner_id !== user.id)
            throw new Error('Only the owner can delete the channel');
        await this.channelRepository.delete(channelId);
        await this.esClient.delete({
            index: 'channels',
            id: channelId,
        });
        return { message: 'Channel deleted successfully' };
    }
};
exports.ChannelService = ChannelService;
exports.ChannelService = ChannelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel)),
    __param(1, (0, typeorm_1.InjectRepository)(server_entity_1.Server)),
    __param(2, (0, typeorm_1.InjectRepository)(channel_member_entity_1.ChannelMember)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        user_service_1.UserService,
        channel_member_service_1.ChannelMemberService])
], ChannelService);
//# sourceMappingURL=channel.service.js.map