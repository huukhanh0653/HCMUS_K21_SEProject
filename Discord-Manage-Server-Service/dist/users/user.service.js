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
        const existingUser = await this.userRepository.findOne({
            where: [{ username: data.username }, { email: data.email }],
        });
        if (existingUser) {
            throw new Error('Username or email already exists');
        }
        const user = this.userRepository.create({
            ...data,
            created_at: new Date(),
            updated_at: new Date(),
        });
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
    async getUserByUsername(username) {
        const user = await this.userRepository.findOne({ where: { username } });
        if (!user)
            throw new Error('User not found');
        return user;
    }
    async searchUsers(query) {
        const result = await this.esClient.search({
            index: 'users',
            body: {
                query: {
                    bool: {
                        should: [
                            { query_string: { query: `*${query}*`, fields: ['username'] } },
                            { query_string: { query: `*${query}*`, fields: ['email'] } },
                        ],
                        minimum_should_match: 1,
                    },
                },
            },
        });
        const hits = result.hits.hits;
        if (hits.length === 0) {
            throw new Error('No users found');
        }
        return hits;
    }
    async updateUser(username, data) {
        const user = await this.getUserByUsername(username);
        if (!user)
            throw new Error('User not found');
        await this.userRepository.update(user.id, {
            ...data,
            updated_at: new Date(),
        });
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
    async deleteUser(username) {
        const user = await this.getUserByUsername(username);
        if (!user)
            throw new Error('User not found');
        await this.userRepository.delete(user.id);
        await this.esClient.delete({
            index: 'users',
            id: user.id,
        });
        return { message: 'User deleted successfully' };
    }
    async getAllUsers() {
        const result = await this.esClient.search({
            index: 'users',
            body: {
                query: {
                    match_all: {},
                },
            },
        });
        return result.hits.hits.map((hit) => hit._source);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map