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
        const user = await this.userService.getUserByUsername(username);
        if (!user)
            throw new Error('User not found');
        const server = await this.serverRepository.findOne({
            where: { id: serverId },
        });
        if (!server)
            throw new Error('Server not found');
        let role = null;
        if (data.role_id) {
            role = await this.roleService.getRole(data.role_id);
            if (!role)
                throw new Error('Role not found');
        }
        if (server.owner_id !== user.id)
            throw new Error('Only the owner can add members');
        const existingMember = await this.serverMemberRepository.findOne({
            where: { server_id: serverId, user_id: user.id },
        });
        if (existingMember)
            throw new Error('User is already a member');
        const member = this.serverMemberRepository.create({
            server_id: serverId,
            user_id: user.id,
            role_id: data.role_id,
            joined_at: new Date(),
            updated_at: new Date(),
        });
        await this.serverMemberRepository.save(member);
        await this.esClient.index({
            index: 'server_members',
            id: member.id,
            body: {
                server_id: serverId,
                server_name: server.name,
                username: user.username,
                role_name: role ? role.name : null,
                profile_pic: user.profile_pic,
                joined_at: member.joined_at,
            },
        });
        return {
            message: `${username} added to server ${server.name}${role ? ` with role ${role.name}` : ''}`,
        };
    }
    async removeMember(serverId, username) {
        const user = await this.userService.getUserByUsername(username);
        if (!user)
            throw new Error('User not found');
        const server = await this.serverRepository.findOne({
            where: { id: serverId },
        });
        if (!server)
            throw new Error('Server not found');
        if (server.owner_id !== user.id)
            throw new Error('Only the owner can remove members');
        const member = await this.serverMemberRepository.findOne({
            where: { server_id: serverId, user_id: user.id },
        });
        if (!member)
            throw new Error('User is not a member');
        await this.serverMemberRepository.delete(member.id);
        await this.esClient.delete({
            index: 'server_members',
            id: member.id,
        });
        return { message: `${username} removed from server ${server.name}` };
    }
    async updateMemberRole(serverId, username, data) {
        const user = await this.userService.getUserByUsername(username);
        if (!user)
            throw new Error('User not found');
        const server = await this.serverRepository.findOne({
            where: { id: serverId },
        });
        if (!server)
            throw new Error('Server not found');
        let role = null;
        if (data.role_id) {
            role = await this.roleService.getRole(data.role_id);
            if (!role)
                throw new Error('Role not found');
        }
        if (server.owner_id !== user.id)
            throw new Error('Only the owner can update member roles');
        const member = await this.serverMemberRepository.findOne({
            where: { server_id: serverId, user_id: user.id },
        });
        if (!member)
            throw new Error('User is not a member');
        await this.serverMemberRepository.update(member.id, {
            role_id: data.role_id,
            updated_at: new Date(),
        });
        await this.esClient.update({
            index: 'server_members',
            id: member.id,
            body: {
                doc: { role_name: role ? role.name : null },
            },
        });
        return {
            message: `Updated role of ${username}${role ? ` to ${role.name}` : ' (role removed)'}`,
        };
    }
    async getMembers(serverId, username) {
        const user = await this.userService.getUserByUsername(username);
        if (!user)
            throw new Error('User not found');
        const server = await this.serverRepository.findOne({
            where: { id: serverId },
        });
        if (!server)
            throw new Error('Server not found');
        if (server.owner_id !== user.id)
            throw new Error('Only the owner can view members');
        const members = await this.serverMemberRepository.find({
            where: { server_id: serverId },
            relations: ['user', 'role'],
        });
        for (const member of members) {
            await this.esClient.index({
                index: 'server_members',
                id: member.id,
                body: {
                    server_id: serverId,
                    server_name: server.name,
                    username: member.user.username,
                    role_name: member.role ? member.role.name : null,
                    profile_pic: member.user.profile_pic,
                    joined_at: member.joined_at,
                },
            });
        }
        const result = await this.esClient.search({
            index: 'server_members',
            body: {
                query: {
                    term: { server_id: serverId },
                },
            },
        });
        const memberList = result.hits.hits.map((hit) => ({
            username: hit._source.username,
            role_name: hit._source.role_name,
            profile_pic: hit._source.profile_pic,
            joined_at: hit._source.joined_at,
        }));
        return memberList;
    }
    async searchMember(serverId, query, username) {
        const user = await this.userService.getUserByUsername(username);
        if (!user)
            throw new Error('User not found');
        const server = await this.serverRepository.findOne({
            where: { id: serverId },
        });
        if (!server)
            throw new Error('Server not found');
        if (server.owner_id !== user.id)
            throw new Error('Only the owner can search members');
        const result = await this.esClient.search({
            index: 'server_members',
            body: {
                query: {
                    bool: {
                        filter: [{ term: { server_id: serverId } }],
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
            role_name: hit._source.role_name,
            profile_pic: hit._source.profile_pic,
            joined_at: hit._source.joined_at,
        }));
        if (members.length === 0)
            throw new Error('No members found matching the query');
        return members;
    }
};
exports.ServerMemberService = ServerMemberService;
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