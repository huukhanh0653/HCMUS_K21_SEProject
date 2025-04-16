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
const microservices_1 = require("@nestjs/microservices");
const role_dto_1 = require("./role.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
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
        const roleDto = (0, class_transformer_1.plainToClass)(role_dto_1.RoleDto, data);
        const errors = await (0, class_validator_1.validate)(roleDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(`Validation failed: ${errors
                .map((e) => e.constraints
                ? Object.values(e.constraints).join(', ')
                : 'Unknown error')
                .join('; ')}`);
        }
        const server = await this.serverRepository.findOne({
            where: { id: serverId },
        });
        if (!server)
            throw new common_1.NotFoundException('Server not found');
        const existingRole = await this.roleRepository.findOne({
            where: { server_id: serverId, name: data.name },
        });
        if (existingRole)
            throw new common_1.BadRequestException('Role with this name already exists in the server');
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
    async updateRole(roleId, data) {
        const roleDto = (0, class_transformer_1.plainToClass)(role_dto_1.RoleDto, data);
        const errors = await (0, class_validator_1.validate)(roleDto, { skipMissingProperties: true });
        if (errors.length > 0) {
            throw new common_1.BadRequestException(`Validation failed: ${errors
                .map((e) => e.constraints
                ? Object.values(e.constraints).join(', ')
                : 'Unknown error')
                .join('; ')}`);
        }
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        if (!role)
            throw new common_1.NotFoundException('Role not found');
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
    async getRole(roleId) {
        const role = await this.roleRepository.findOne({
            where: { id: roleId },
            relations: ['server'],
        });
        if (!role)
            throw new common_1.NotFoundException('Role not found');
        return role;
    }
    async getRolesByServer(serverId) {
        const result = await this.esClient.search({
            index: 'roles',
            body: { query: { term: { server_id: serverId } } },
        });
        return result.hits.hits.map((hit) => hit._source);
    }
    async deleteRole(roleId) {
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        if (!role)
            throw new common_1.NotFoundException('Role not found');
        await this.roleRepository.delete(roleId);
        await this.esClient.delete({ index: 'roles', id: roleId });
        return { message: 'Role deleted successfully' };
    }
    async createRoleGrpc(data) {
        const role = await this.createRole(data.server_id, data);
        return this.mapRoleToResponse(role);
    }
    async updateRoleGrpc(data) {
        const result = await this.updateRole(data.role_id, data);
        return { message: result.message };
    }
    async getRoleGrpc(data) {
        const role = await this.getRole(data.role_id);
        return this.mapRoleToResponse(role);
    }
    async getRolesByServerGrpc(data) {
        const roles = await this.getRolesByServer(data.server_id);
        return { roles: roles.map((role) => this.mapRoleToResponse(role)) };
    }
    async deleteRoleGrpc(data) {
        const result = await this.deleteRole(data.role_id);
        return { message: result.message };
    }
    mapRoleToResponse(role) {
        return {
            id: role.id,
            server_id: role.server_id,
            name: role.name,
            color: role.color || '',
            position: role.position || 0,
            is_default: role.is_default || false,
        };
    }
};
exports.RoleService = RoleService;
__decorate([
    (0, microservices_1.GrpcMethod)('RoleService', 'CreateRole'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleService.prototype, "createRoleGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('RoleService', 'UpdateRole'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleService.prototype, "updateRoleGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('RoleService', 'GetRole'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleService.prototype, "getRoleGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('RoleService', 'GetRolesByServer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleService.prototype, "getRolesByServerGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('RoleService', 'DeleteRole'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleService.prototype, "deleteRoleGrpc", null);
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(1, (0, typeorm_1.InjectRepository)(server_entity_1.Server)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RoleService);
//# sourceMappingURL=role.service.js.map