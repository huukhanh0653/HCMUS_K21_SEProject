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
exports.RoleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("./role.entity");
const server_entity_1 = require("../servers/server.entity");
const elasticsearch_1 = require("@elastic/elasticsearch");
let RoleService = class RoleService {
    roleRepository;
    serverRepository;
    constructor(roleRepository, serverRepository) {
        this.roleRepository = roleRepository;
        this.serverRepository = serverRepository;
        this.esClient = new elasticsearch_1.Client({
            node: process.env.ELASTIC_NODE,
            auth: { apiKey: process.env.ELASTIC_API_KEY },
        });
    }
    esClient;
    async createRole(serverId, data) {
        const server = await this.serverRepository.findOne({
            where: { id: serverId },
        });
        if (!server)
            throw new Error('Server not found');
        const existingRole = await this.roleRepository.findOne({
            where: { server_id: serverId, name: data.name },
        });
        if (existingRole)
            throw new Error('Role with this name already exists in the server');
        const role = this.roleRepository.create({
            server_id: serverId,
            name: data.name,
            color: data.color,
            position: data.position,
            is_default: data.is_default || false,
        });
        await this.roleRepository.save(role);
        await this.esClient.index({
            index: 'roles',
            id: role.id,
            body: {
                server_id: serverId,
                name: role.name,
                color: role.color,
                position: role.position,
                is_default: role.is_default,
            },
        });
        return role;
    }
    async getRole(roleId) {
        const role = await this.roleRepository.findOne({
            where: { id: roleId },
            relations: ['server'],
        });
        if (!role)
            throw new Error('Role not found');
        return role;
    }
    async getRolesByServer(serverId) {
        const roles = await this.roleRepository.find({
            where: { server_id: serverId },
            relations: ['server'],
        });
        for (const role of roles) {
            await this.esClient.index({
                index: 'roles',
                id: role.id,
                body: {
                    server_id: serverId,
                    name: role.name,
                    color: role.color,
                    position: role.position,
                    is_default: role.is_default,
                },
            });
        }
        const result = await this.esClient.search({
            index: 'roles',
            body: {
                query: {
                    term: { server_id: serverId },
                },
            },
        });
        return result.hits.hits.map((hit) => hit._source);
    }
    async updateRole(roleId, data) {
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        if (!role)
            throw new Error('Role not found');
        await this.roleRepository.update(roleId, data);
        await this.esClient.update({
            index: 'roles',
            id: roleId,
            body: {
                doc: {
                    name: data.name || role.name,
                    color: data.color || role.color,
                    position: data.position || role.position,
                    is_default: data.is_default !== undefined ? data.is_default : role.is_default,
                },
            },
        });
        return { message: 'Role updated successfully' };
    }
    async deleteRole(roleId) {
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        if (!role)
            throw new Error('Role not found');
        await this.roleRepository.delete(roleId);
        await this.esClient.delete({
            index: 'roles',
            id: roleId,
        });
        return { message: 'Role deleted successfully' };
    }
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(1, (0, typeorm_1.InjectRepository)(server_entity_1.Server)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RoleService);
//# sourceMappingURL=role.service.js.map