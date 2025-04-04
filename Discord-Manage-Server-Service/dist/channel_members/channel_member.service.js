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
exports.ChannelMemberService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const channel_member_entity_1 = require("./channel_member.entity");
const channel_entity_1 = require("../channels/channel.entity");
const user_service_1 = require("../users/user.service");
const elasticsearch_1 = require("@elastic/elasticsearch");
let ChannelMemberService = class ChannelMemberService {
    channelMemberRepository;
    channelRepository;
    userService;
    constructor(channelMemberRepository, channelRepository, userService) {
        this.channelMemberRepository = channelMemberRepository;
        this.channelRepository = channelRepository;
        this.userService = userService;
        this.esClient = new elasticsearch_1.Client({
            node: process.env.ELASTIC_NODE,
            auth: { apiKey: process.env.ELASTIC_API_KEY },
        });
    }
    esClient;
    async addMember(channelId, username, data) {
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
            throw new Error('Only the owner can add members');
        const memberToAdd = await this.userService.getUserByUsername(data.username);
        if (!memberToAdd)
            throw new Error('User to add not found');
        const existingMember = await this.channelMemberRepository.findOne({
            where: { channel_id: channelId, user_id: memberToAdd.id },
        });
        if (existingMember)
            throw new Error('User is already a member of this channel');
        const member = this.channelMemberRepository.create({
            channel_id: channelId,
            user_id: memberToAdd.id,
            created_at: new Date(),
        });
        await this.channelMemberRepository.save(member);
        await this.esClient.index({
            index: 'channel_members',
            id: member.id,
            body: {
                channel_id: channelId,
                channel_name: channel.name,
                username: memberToAdd.username,
                profile_pic: memberToAdd.profile_pic,
                created_at: member.created_at,
            },
        });
        return {
            message: `${memberToAdd.username} added to channel ${channel.name}`,
        };
    }
    async removeMember(channelId, username, memberUsername) {
        const user = await this.userService.getUserByUsername(username);
        if (!user)
            throw new Error('User not found');
        const memberToRemove = await this.userService.getUserByUsername(memberUsername);
        if (!memberToRemove)
            throw new Error('User to remove not found');
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['server'],
        });
        if (!channel)
            throw new Error('Channel not found');
        if (channel.server.owner_id !== user.id)
            throw new Error('Only the owner can remove members');
        const member = await this.channelMemberRepository.findOne({
            where: { channel_id: channelId, user_id: memberToRemove.id },
        });
        if (!member)
            throw new Error('User is not a member of this channel');
        await this.channelMemberRepository.delete(member.id);
        await this.esClient.delete({
            index: 'channel_members',
            id: member.id,
        });
        return {
            message: `${memberToRemove.username} removed from channel ${channel.name}`,
        };
    }
    async getMembers(channelId, username) {
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
            throw new Error('Only the owner can view members');
        const members = await this.channelMemberRepository.find({
            where: { channel_id: channelId },
            relations: ['user'],
        });
        for (const member of members) {
            await this.esClient.index({
                index: 'channel_members',
                id: member.id,
                body: {
                    channel_id: channelId,
                    channel_name: channel.name,
                    username: member.user.username,
                    profile_pic: member.user.profile_pic,
                    created_at: member.created_at,
                },
            });
        }
        const result = await this.esClient.search({
            index: 'channel_members',
            body: {
                query: {
                    term: { channel_id: channelId },
                },
            },
        });
        const memberList = result.hits.hits.map((hit) => ({
            username: hit._source.username,
            profile_pic: hit._source.profile_pic,
            created_at: hit._source.created_at,
        }));
        return memberList;
    }
    async searchMember(channelId, query, username) {
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
            throw new Error('Only the owner can search members');
        const result = await this.esClient.search({
            index: 'channel_members',
            body: {
                query: {
                    bool: {
                        filter: [{ term: { channel_id: channelId } }],
                        must: [
                            {
                                query_string: {
                                    query: `*${query}*`,
                                    fields: ['username'],
                                },
                            },
                        ],
                    },
                },
            },
        });
        const members = result.hits.hits.map((hit) => ({
            username: hit._source.username,
            profile_pic: hit._source.profile_pic,
            created_at: hit._source.created_at,
        }));
        if (members.length === 0)
            throw new Error('No members found matching the query');
        return members;
    }
};
exports.ChannelMemberService = ChannelMemberService;
exports.ChannelMemberService = ChannelMemberService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(channel_member_entity_1.ChannelMember)),
    __param(1, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        user_service_1.UserService])
], ChannelMemberService);
//# sourceMappingURL=channel_member.service.js.map