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
exports.ServerMemberService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const server_member_entity_1 = require("./server_member.entity");
const server_entity_1 = require("../servers/server.entity");
const user_service_1 = require("../users/user.service");
const role_service_1 = require("../roles/role.service");
const elasticsearch_1 = require("@elastic/elasticsearch");
const microservices_1 = require("@nestjs/microservices");
const server_member_dto_1 = require("./server_member.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let ServerMemberService = class ServerMemberService {
    serverMemberRepository;
    serverRepository;
    userService;
    roleService;
    constructor(serverMemberRepository, serverRepository, userService, roleService) {
        this.serverMemberRepository = serverMemberRepository;
        this.serverRepository = serverRepository;
        this.userService = userService;
        this.roleService = roleService;
        this.esClient = new elasticsearch_1.Client({
            node: process.env.ELASTIC_NODE,
            auth: { apiKey: process.env.ELASTIC_API_KEY },
        });
    }
    esClient;
    async addMember(serverId, username, data) {
        const serverMemberDto = (0, class_transformer_1.plainToClass)(server_member_dto_1.ServerMemberDto, data);
        const errors = await (0, class_validator_1.validate)(serverMemberDto);
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
            throw new common_1.ForbiddenException('Only the owner can add members');
        let role = null;
        if (data.role_id) {
            role = await this.roleService.getRole(data.role_id);
            if (!role)
                throw new common_1.NotFoundException('Role not found');
        }
        const memberToAdd = await this.userService.getUserByUsername(data.username);
        if (!memberToAdd)
            throw new common_1.NotFoundException('User to add not found');
        const existingMember = await this.serverMemberRepository.findOne({
            where: { server_id: serverId, user_id: memberToAdd.id },
        });
        if (existingMember)
            throw new common_1.BadRequestException('User is already a member');
        const member = this.serverMemberRepository.create({
            server_id: serverId,
            user_id: memberToAdd.id,
            role_id: data.role_id,
        });
        await this.serverMemberRepository.save(member);
        await this.esClient.index({
            index: 'server_members',
            id: member.id,
            body: {
                server_id: serverId,
                server_name: server.name,
                username: memberToAdd.username,
                role_name: role ? role.name : null,
                profile_pic: memberToAdd.profile_pic,
                joined_at: member.joined_at,
            },
        });
        return {
            message: `${memberToAdd.username} added to server ${server.name}${role ? ` with role ${role.name}` : ''}`,
        };
    }
    async removeMember(serverId, username, memberUsername) {
        const user = await this.userService.getUserByUsername(username);
        const memberToRemove = await this.userService.getUserByUsername(memberUsername);
        const server = await this.serverRepository.findOne({
            where: { id: serverId },
        });
        if (!server)
            throw new common_1.NotFoundException('Server not found');
        if (server.owner_id !== user.id)
            throw new common_1.ForbiddenException('Only the owner can remove members');
        const member = await this.serverMemberRepository.findOne({
            where: { server_id: serverId, user_id: memberToRemove.id },
        });
        if (!member)
            throw new common_1.NotFoundException('User is not a member');
        await this.serverMemberRepository.delete(member.id);
        await this.esClient.delete({ index: 'server_members', id: member.id });
        return { message: `${memberUsername} removed from server ${server.name}` };
    }
    async updateMemberRole(serverId, username, data) {
        const serverMemberDto = (0, class_transformer_1.plainToClass)(server_member_dto_1.ServerMemberDto, data);
        const errors = await (0, class_validator_1.validate)(serverMemberDto, {
            skipMissingProperties: true,
        });
        if (errors.length > 0) {
            throw new common_1.BadRequestException(`Validation failed: ${errors
                .map((e) => e.constraints
                ? Object.values(e.constraints).join(', ')
                : 'Unknown error')
                .join('; ')}`);
        }
        const user = await this.userService.getUserByUsername(username);
        const memberToUpdate = await this.userService.getUserByUsername(data.username);
        const server = await this.serverRepository.findOne({
            where: { id: serverId },
        });
        if (!server)
            throw new common_1.NotFoundException('Server not found');
        if (server.owner_id !== user.id)
            throw new common_1.ForbiddenException('Only the owner can update member roles');
        let role = null;
        if (data.role_id) {
            role = await this.roleService.getRole(data.role_id);
            if (!role)
                throw new common_1.NotFoundException('Role not found');
        }
        const member = await this.serverMemberRepository.findOne({
            where: { server_id: serverId, user_id: memberToUpdate.id },
        });
        if (!member)
            throw new common_1.NotFoundException('User is not a member');
        await this.serverMemberRepository.update(member.id, {
            role_id: data.role_id,
        });
        await this.esClient.update({
            index: 'server_members',
            id: member.id,
            body: { doc: { role_name: role ? role.name : null } },
        });
        return {
            message: `Updated role of ${data.username}${role ? ` to ${role.name}` : ' (role removed)'}`,
        };
    }
    async getMembers(serverId, username) {
        const user = await this.userService.getUserByUsername(username);
        const server = await this.serverRepository.findOne({
            where: { id: serverId },
        });
        if (!server)
            throw new common_1.NotFoundException('Server not found');
        if (server.owner_id !== user.id)
            throw new common_1.ForbiddenException('Only the owner can view members');
        const result = await this.esClient.search({
            index: 'server_members',
            body: { query: { term: { server_id: serverId } } },
        });
        return result.hits.hits.map((hit) => hit._source);
    }
    async searchMember(serverId, query, username) {
        const user = await this.userService.getUserByUsername(username);
        const server = await this.serverRepository.findOne({
            where: { id: serverId },
        });
        if (!server)
            throw new common_1.NotFoundException('Server not found');
        if (server.owner_id !== user.id)
            throw new common_1.ForbiddenException('Only the owner can search members');
        const result = await this.esClient.search({
            index: 'server_members',
            body: {
                query: {
                    bool: {
                        filter: [{ term: { server_id: serverId } }],
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
        const result = await this.addMember(data.server_id, data.username, data);
        return { message: result.message };
    }
    async updateMemberRoleGrpc(data) {
        const result = await this.updateMemberRole(data.server_id, data.username, data);
        return { message: result.message };
    }
    async removeMemberGrpc(data) {
        const result = await this.removeMember(data.server_id, data.username, data.member_username);
        return { message: result.message };
    }
    async getMembersGrpc(data) {
        const members = await this.getMembers(data.server_id, data.username);
        return {
            members: members.map((member) => this.mapMemberToInfo(member)),
        };
    }
    async searchMemberGrpc(data) {
        const members = await this.searchMember(data.server_id, data.query, data.username);
        return {
            members: members.map((member) => this.mapMemberToInfo(member)),
        };
    }
    mapMemberToInfo(member) {
        return {
            username: member.username,
            role_name: member.role_name || '',
            profile_pic: member.profile_pic || '',
            joined_at: member.joined_at.toISOString(),
        };
    }
};
exports.ServerMemberService = ServerMemberService;
__decorate([
    (0, microservices_1.GrpcMethod)('ServerMemberService', 'AddMember'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerMemberService.prototype, "addMemberGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ServerMemberService', 'UpdateMemberRole'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerMemberService.prototype, "updateMemberRoleGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ServerMemberService', 'RemoveMember'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerMemberService.prototype, "removeMemberGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ServerMemberService', 'GetMembers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerMemberService.prototype, "getMembersGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ServerMemberService', 'SearchMember'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerMemberService.prototype, "searchMemberGrpc", null);
exports.ServerMemberService = ServerMemberService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(server_member_entity_1.ServerMember)),
    __param(1, (0, typeorm_1.InjectRepository)(server_entity_1.Server)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        user_service_1.UserService,
        role_service_1.RoleService])
], ServerMemberService);
//# sourceMappingURL=server_member.service.js.map