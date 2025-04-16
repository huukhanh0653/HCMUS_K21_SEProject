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
const microservices_1 = require("@nestjs/microservices");
const channel_member_dto_1 = require("./channel_member.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
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
        const channelMemberDto = (0, class_transformer_1.plainToClass)(channel_member_dto_1.ChannelMemberDto, data);
        const errors = await (0, class_validator_1.validate)(channelMemberDto);
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
            throw new common_1.ForbiddenException('Only the owner can add members');
        const memberToAdd = await this.userService.getUserByUsername(data.username);
        if (!memberToAdd)
            throw new common_1.NotFoundException('User to add not found');
        const existingMember = await this.channelMemberRepository.findOne({
            where: { channel_id: channelId, user_id: memberToAdd.id },
        });
        if (existingMember)
            throw new common_1.BadRequestException('User is already a member of this channel');
        const member = this.channelMemberRepository.create({
            channel_id: channelId,
            user_id: memberToAdd.id,
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
        const memberToRemove = await this.userService.getUserByUsername(memberUsername);
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['server'],
        });
        if (!channel)
            throw new common_1.NotFoundException('Channel not found');
        if (channel.server.owner_id !== user.id)
            throw new common_1.ForbiddenException('Only the owner can remove members');
        const member = await this.channelMemberRepository.findOne({
            where: { channel_id: channelId, user_id: memberToRemove.id },
        });
        if (!member)
            throw new common_1.NotFoundException('User is not a member of this channel');
        await this.channelMemberRepository.delete(member.id);
        await this.esClient.delete({ index: 'channel_members', id: member.id });
        return {
            message: `${memberToRemove.username} removed from channel ${channel.name}`,
        };
    }
    async getMembers(channelId, username) {
        const user = await this.userService.getUserByUsername(username);
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['server'],
        });
        if (!channel)
            throw new common_1.NotFoundException('Channel not found');
        if (channel.server.owner_id !== user.id)
            throw new common_1.ForbiddenException('Only the owner can view members');
        const result = await this.esClient.search({
            index: 'channel_members',
            body: { query: { term: { channel_id: channelId } } },
        });
        return result.hits.hits.map((hit) => hit._source);
    }
    async searchMember(channelId, query, username) {
        const user = await this.userService.getUserByUsername(username);
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['server'],
        });
        if (!channel)
            throw new common_1.NotFoundException('Channel not found');
        if (channel.server.owner_id !== user.id)
            throw new common_1.ForbiddenException('Only the owner can search members');
        const result = await this.esClient.search({
            index: 'channel_members',
            body: {
                query: {
                    bool: {
                        filter: [{ term: { channel_id: channelId } }],
                        must: [{ match_phrase_prefix: { username: query } }],
                    },
                },
            },
        });
        const members = result.hits.hits.map((hit) => hit._source);
        if (members.length === 0)
            throw new common_1.NotFoundException('No members found matching the query');
        return members;
    }
    async addMemberGrpc(data) {
        const result = await this.addMember(data.channel_id, data.username, {
            username: data.member_username,
        });
        return { message: result.message };
    }
    async removeMemberGrpc(data) {
        const result = await this.removeMember(data.channel_id, data.username, data.member_username);
        return { message: result.message };
    }
    async getMembersGrpc(data) {
        const members = await this.getMembers(data.channel_id, data.username);
        return {
            members: members.map((member) => this.mapMemberToInfo(member)),
        };
    }
    async searchMemberGrpc(data) {
        const members = await this.searchMember(data.channel_id, data.query, data.username);
        return {
            members: members.map((member) => this.mapMemberToInfo(member)),
        };
    }
    mapMemberToInfo(member) {
        return {
            username: member.username,
            profile_pic: member.profile_pic || '',
            created_at: member.created_at.toISOString(),
        };
    }
};
exports.ChannelMemberService = ChannelMemberService;
__decorate([
    (0, microservices_1.GrpcMethod)('ChannelMemberService', 'AddMember'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelMemberService.prototype, "addMemberGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ChannelMemberService', 'RemoveMember'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelMemberService.prototype, "removeMemberGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ChannelMemberService', 'GetMembers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelMemberService.prototype, "getMembersGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ChannelMemberService', 'SearchMember'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelMemberService.prototype, "searchMemberGrpc", null);
exports.ChannelMemberService = ChannelMemberService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(channel_member_entity_1.ChannelMember)),
    __param(1, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        user_service_1.UserService])
], ChannelMemberService);
//# sourceMappingURL=channel_member.service.js.map