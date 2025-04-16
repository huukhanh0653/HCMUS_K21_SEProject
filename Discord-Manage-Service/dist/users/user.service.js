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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const elasticsearch_1 = require("@elastic/elasticsearch");
const microservices_1 = require("@nestjs/microservices");
const user_dto_1 = require("./user.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let UserService = class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.esClient = new elasticsearch_1.Client({
            node: process.env.ELASTIC_NODE,
            auth: { apiKey: process.env.ELASTIC_API_KEY },
        });
    }
    esClient;
    async createUser(data) {
        const userDto = (0, class_transformer_1.plainToClass)(user_dto_1.UserDto, data);
        const errors = await (0, class_validator_1.validate)(userDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(`Validation failed: ${errors
                .map((e) => e.constraints
                ? Object.values(e.constraints).join(', ')
                : 'Unknown error')
                .join('; ')}`);
        }
        const existingUser = await this.userRepository.findOne({
            where: [{ username: data.username }, { email: data.email }],
        });
        if (existingUser)
            throw new common_1.BadRequestException('Username or email already exists');
        const user = this.userRepository.create(data);
        await this.userRepository.save(user);
        await this.esClient.index({
            index: 'users',
            id: user.id,
            body: {
                username: user.username,
                email: user.email,
                profile_pic: user.profile_pic,
                status: user.status,
                is_admin: user.is_admin,
            },
        });
        return user;
    }
    async updateUser(username, data) {
        const userDto = (0, class_transformer_1.plainToClass)(user_dto_1.UserDto, data);
        const errors = await (0, class_validator_1.validate)(userDto, { skipMissingProperties: true });
        if (errors.length > 0) {
            throw new common_1.BadRequestException(`Validation failed: ${errors
                .map((e) => e.constraints
                ? Object.values(e.constraints).join(', ')
                : 'Unknown error')
                .join('; ')}`);
        }
        const user = await this.getUserByUsername(username);
        await this.userRepository.update(user.id, data);
        await this.esClient.update({
            index: 'users',
            id: user.id,
            body: {
                doc: {
                    username: data.username || user.username,
                    email: data.email || user.email,
                    profile_pic: data.profile_pic || user.profile_pic,
                    status: data.status || user.status,
                },
            },
        });
        return { message: 'User updated successfully' };
    }
    async getUserByUsername(username) {
        const user = await this.userRepository.findOne({ where: { username } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async searchUsers(query) {
        const result = await this.esClient.search({
            index: 'users',
            body: {
                query: {
                    multi_match: {
                        query,
                        fields: ['username', 'email'],
                        type: 'phrase_prefix',
                    },
                },
            },
        });
        const hits = result.hits.hits;
        if (hits.length === 0)
            throw new common_1.NotFoundException('No users found');
        return hits.map((hit) => hit._source);
    }
    async deleteUser(username) {
        const user = await this.getUserByUsername(username);
        await this.userRepository.delete(user.id);
        await this.esClient.delete({ index: 'users', id: user.id });
        return { message: 'User deleted successfully' };
    }
    async getAllUsers() {
        const result = await this.esClient.search({
            index: 'users',
            body: { query: { match_all: {} } },
        });
        return result.hits.hits.map((hit) => hit._source);
    }
    async createUserGrpc(data) {
        const user = await this.createUser(data);
        return this.mapUserToResponse(user);
    }
    async updateUserGrpc(data) {
        const result = await this.updateUser(data.username, data);
        return { message: result.message };
    }
    async getUserByUsernameGrpc(data) {
        const user = await this.getUserByUsername(data.username);
        return this.mapUserToResponse(user);
    }
    async searchUsersGrpc(data) {
        const users = await this.searchUsers(data.query);
        return { users: users.map((user) => this.mapUserToResponse(user)) };
    }
    async deleteUserGrpc(data) {
        const result = await this.deleteUser(data.username);
        return { message: result.message };
    }
    async getAllUsersGrpc(data) {
        const users = await this.getAllUsers();
        return { users: users.map((user) => this.mapUserToResponse(user)) };
    }
    mapUserToResponse(user) {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            profile_pic: user.profile_pic || '',
            status: user.status || '',
            created_at: user.created_at.toISOString(),
            updated_at: user.updated_at.toISOString(),
            is_admin: user.is_admin || false,
        };
    }
};
exports.UserService = UserService;
__decorate([
    (0, microservices_1.GrpcMethod)('UserService', 'CreateUser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "createUserGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('UserService', 'UpdateUser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "updateUserGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('UserService', 'GetUserByUsername'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "getUserByUsernameGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('UserService', 'SearchUsers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "searchUsersGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('UserService', 'DeleteUser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "deleteUserGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('UserService', 'GetAllUsers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "getAllUsersGrpc", null);
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map