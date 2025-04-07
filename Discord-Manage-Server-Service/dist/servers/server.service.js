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
        const user = await this.userService.getUserByUsername(username);
        if (!user)
            throw new Error('User not found');
        const server = this.serverRepository.create({
            name: data.name,
            owner_id: user.id,
            created_at: new Date(),
            server_pic: data.server_pic,
        });
        await this.serverRepository.save(server);
        await this.esClient.index({
            index: 'servers',
            id: server.id,
            body: {
                name: server.name,
                owner_username: user.username,
                created_at: server.created_at,
                server_pic: server.server_pic,
            },
        });
        return server;
    }
    async getServerById(id) {
        const server = await this.serverRepository.findOne({ where: { id } });
        if (!server)
            throw new Error('Server not found');
        return server;
    }
    async getServers(username, query) {
        const user = await this.userService.getUserByUsername(username);
        if (!user) {
            throw new Error('User not found');
        }
        const result = await this.esClient.search({
            index: 'servers',
            body: {
                query: {
                    bool: {
                        filter: [{ term: { owner_username: username } }],
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
        const servers = result.hits.hits.map((hit) => hit._source);
        if (servers.length === 0) {
            throw new Error('No servers found');
        }
        return servers;
    }
    async getAllServers(username) {
        const user = await this.userService.getUserByUsername(username);
        if (!user) {
            throw new Error('User not found');
        }
        const result = await this.esClient.search({
            index: 'servers',
            body: {
                query: {
                    term: { owner_username: username },
                },
            },
        });
        return result.hits.hits.map((hit) => hit._source);
    }
    async updateServer(serverId, data, username) {
        const user = await this.userService.getUserByUsername(username);
        if (!user)
            throw new Error('User not found');
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
            body: {
                doc: {
                    name: updatedData.name,
                    server_pic: updatedData.server_pic,
                },
            },
        });
        return { message: 'Server updated successfully' };
    }
    async deleteServer(serverId, username) {
        const user = await this.userService.getUserByUsername(username);
        if (!user)
            throw new Error('User not found');
        const server = await this.serverRepository.findOne({
            where: { id: serverId },
        });
        if (!server)
            throw new Error('Server not found');
        if (server.owner_id !== user.id)
            throw new Error('Only the owner can delete the server');
        await this.serverRepository.delete(serverId);
        await this.esClient.delete({
            index: 'servers',
            id: serverId,
        });
        return { message: 'Server deleted successfully' };
    }
};
exports.ServerService = ServerService;
exports.ServerService = ServerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(server_entity_1.Server)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService])
], ServerService);
//# sourceMappingURL=server.service.js.map