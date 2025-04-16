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
exports.ServerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const server_entity_1 = require("./server.entity");
const user_service_1 = require("../users/user.service");
const elasticsearch_1 = require("@elastic/elasticsearch");
const microservices_1 = require("@nestjs/microservices");
const server_dto_1 = require("./server.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let ServerService = class ServerService {
    serverRepository;
    userService;
    constructor(serverRepository, userService) {
        this.serverRepository = serverRepository;
        this.userService = userService;
        this.esClient = new elasticsearch_1.Client({
            node: process.env.ELASTIC_NODE,
            auth: { apiKey: process.env.ELASTIC_API_KEY },
        });
    }
    esClient;
    async createServer(data, username) {
        const serverDto = (0, class_transformer_1.plainToClass)(server_dto_1.ServerDto, data);
        const errors = await (0, class_validator_1.validate)(serverDto);
        if (errors.length > 0) {
            throw new Error(`Validation failed: ${errors
                .map((e) => e.constraints
                ? Object.values(e.constraints).join(', ')
                : 'Unknown error')
                .join('; ')}`);
        }
        const user = await this.userService.getUserByUsername(username);
        if (!user)
            throw new Error('User not found');
        const server = this.serverRepository.create({
            name: data.name,
            owner_id: user.id,
            server_pic: data.server_pic,
        });
        await this.serverRepository.save(server);
        await this.esClient.index({
            index: 'servers',
            id: server.id,
            body: {
                name: server.name,
                owner_username: user.username,
                server_pic: server.server_pic,
                created_at: server.created_at,
            },
        });
        return server;
    }
    async updateServer(serverId, data, username) {
        const serverDto = (0, class_transformer_1.plainToClass)(server_dto_1.ServerDto, data);
        const errors = await (0, class_validator_1.validate)(serverDto, { skipMissingProperties: true });
        if (errors.length > 0) {
            throw new Error(`Validation failed: ${errors
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
            throw new Error('Server not found');
        if (server.owner_id !== user.id)
            throw new Error('Only the owner can update the server');
        const updatedData = {
            name: data.name || server.name,
            server_pic: data.server_pic !== undefined ? data.server_pic : server.server_pic,
        };
        await this.serverRepository.update(serverId, updatedData);
        await this.esClient.update({
            index: 'servers',
            id: serverId,
            body: { doc: updatedData },
        });
        return { message: 'Server updated successfully' };
    }
    async getServers(username, query) {
        const user = await this.userService.getUserByUsername(username);
        if (!user)
            throw new Error('User not found');
        const result = await this.esClient.search({
            index: 'servers',
            body: {
                query: {
                    bool: {
                        filter: [{ term: { owner_username: username } }],
                        must: [{ query_string: { query: `*${query}*`, fields: ['name'] } }],
                    },
                },
            },
        });
        const servers = result.hits.hits.map((hit) => hit._source);
        if (servers.length === 0)
            throw new Error('No servers found');
        return servers;
    }
    async getAllServers(username) {
        const user = await this.userService.getUserByUsername(username);
        if (!user)
            throw new Error('User not found');
        const result = await this.esClient.search({
            index: 'servers',
            body: { query: { term: { owner_username: username } } },
        });
        return result.hits.hits.map((hit) => hit._source);
    }
    async deleteServer(serverId, username) {
        const user = await this.userService.getUserByUsername(username);
        const server = await this.serverRepository.findOne({
            where: { id: serverId },
        });
        if (!server)
            throw new Error('Server not found');
        if (server.owner_id !== user.id)
            throw new Error('Only the owner can delete the server');
        await this.serverRepository.delete(serverId);
        await this.esClient.delete({ index: 'servers', id: serverId });
        return { message: 'Server deleted successfully' };
    }
    async createServerGrpc(data) {
        const server = await this.createServer(data, data.username);
        return this.mapServerToResponse(server);
    }
    async updateServerGrpc(data) {
        const result = await this.updateServer(data.server_id, data, data.username);
        return { message: result.message };
    }
    async getServersGrpc(data) {
        const servers = await this.getServers(data.username, data.query);
        return {
            servers: servers.map((server) => this.mapServerToResponse(server)),
        };
    }
    async getAllServersGrpc(data) {
        const servers = await this.getAllServers(data.username);
        return {
            servers: servers.map((server) => this.mapServerToResponse(server)),
        };
    }
    async deleteServerGrpc(data) {
        const result = await this.deleteServer(data.server_id, data.username);
        return { message: result.message };
    }
    mapServerToResponse(server) {
        return {
            id: server.id,
            name: server.name,
            owner_id: server.owner_id,
            created_at: server.created_at.toISOString(),
            server_pic: server.server_pic || '',
        };
    }
};
exports.ServerService = ServerService;
__decorate([
    (0, microservices_1.GrpcMethod)('ServerService', 'CreateServer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerService.prototype, "createServerGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ServerService', 'UpdateServer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerService.prototype, "updateServerGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ServerService', 'GetServers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerService.prototype, "getServersGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ServerService', 'GetAllServers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerService.prototype, "getAllServersGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ServerService', 'DeleteServer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerService.prototype, "deleteServerGrpc", null);
exports.ServerService = ServerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(server_entity_1.Server)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService])
], ServerService);
//# sourceMappingURL=server.service.js.map