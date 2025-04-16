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
exports.FriendService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const friend_entity_1 = require("./friend.entity");
const user_service_1 = require("../users/user.service");
const elasticsearch_1 = require("@elastic/elasticsearch");
const microservices_1 = require("@nestjs/microservices");
let FriendService = class FriendService {
    friendRepository;
    userService;
    constructor(friendRepository, userService) {
        this.friendRepository = friendRepository;
        this.userService = userService;
        this.esClient = new elasticsearch_1.Client({
            node: process.env.ELASTIC_NODE,
            auth: { apiKey: process.env.ELASTIC_API_KEY },
        });
    }
    esClient;
    async addFriend(username, friendUsername) {
        const user = await this.userService.getUserByUsername(username);
        const friend = await this.userService.getUserByUsername(friendUsername);
        if (!friend)
            throw new common_1.NotFoundException('User wanted to make friend not found');
        if (user.id === friend.id)
            throw new common_1.BadRequestException('Cannot add self as a friend');
        const existingFriendship = await this.friendRepository.findOne({
            where: { user_id: user.id, friend_id: friend.id },
        });
        if (existingFriendship)
            throw new common_1.BadRequestException('Already friends');
        const newFriendship = this.friendRepository.create({
            user_id: user.id,
            friend_id: friend.id,
        });
        await this.friendRepository.save(newFriendship);
        await this.esClient.index({
            index: 'friends',
            id: newFriendship.id,
            body: {
                user_username: user.username,
                friend_username: friend.username,
                friend_status: friend.status,
                friend_profile_pic: friend.profile_pic,
                added_at: newFriendship.added_at,
            },
        });
        return {
            message: `Added ${friend.username} to ${user.username}'s friends list`,
        };
    }
    async removeFriend(username, friendUsername) {
        const user = await this.userService.getUserByUsername(username);
        const friend = await this.userService.getUserByUsername(friendUsername);
        if (!friend)
            throw new common_1.NotFoundException('Friend not found');
        const friendship = await this.friendRepository.findOne({
            where: { user_id: user.id, friend_id: friend.id },
        });
        if (!friendship)
            throw new common_1.NotFoundException('Friend not found in your list');
        await this.friendRepository.delete(friendship.id);
        await this.esClient.delete({ index: 'friends', id: friendship.id });
        return {
            message: `Removed ${friendUsername} from ${username}'s friends list`,
        };
    }
    async getFriends(username) {
        const user = await this.userService.getUserByUsername(username);
        const result = await this.esClient.search({
            index: 'friends',
            body: { query: { term: { user_username: user.username } } },
        });
        return result.hits.hits.map((hit) => hit._source);
    }
    async searchFriend(username, query) {
        const user = await this.userService.getUserByUsername(username);
        const result = await this.esClient.search({
            index: 'friends',
            body: {
                query: {
                    bool: {
                        filter: [{ term: { user_username: user.username } }],
                        must: [{ match_phrase_prefix: { friend_username: query } }],
                    },
                },
            },
        });
        const friends = result.hits.hits.map((hit) => hit._source);
        if (friends.length === 0)
            throw new common_1.NotFoundException('No friends found matching the query');
        return friends;
    }
    async addFriendGrpc(data) {
        const result = await this.addFriend(data.username, data.friend_username);
        return { message: result.message };
    }
    async removeFriendGrpc(data) {
        const result = await this.removeFriend(data.username, data.friend_username);
        return { message: result.message };
    }
    async getFriendsGrpc(data) {
        const friends = await this.getFriends(data.username);
        return {
            friends: friends.map((friend) => this.mapFriendToInfo(friend)),
        };
    }
    async searchFriendGrpc(data) {
        const friends = await this.searchFriend(data.username, data.query);
        return {
            friends: friends.map((friend) => this.mapFriendToInfo(friend)),
        };
    }
    mapFriendToInfo(friend) {
        return {
            friend_username: friend.friend_username,
            friend_status: friend.friend_status || '',
            friend_profile_pic: friend.friend_profile_pic || '',
            added_at: friend.added_at.toISOString(),
        };
    }
};
exports.FriendService = FriendService;
__decorate([
    (0, microservices_1.GrpcMethod)('FriendService', 'AddFriend'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendService.prototype, "addFriendGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('FriendService', 'RemoveFriend'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendService.prototype, "removeFriendGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('FriendService', 'GetFriends'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendService.prototype, "getFriendsGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('FriendService', 'SearchFriend'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FriendService.prototype, "searchFriendGrpc", null);
exports.FriendService = FriendService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(friend_entity_1.Friend)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService])
], FriendService);
//# sourceMappingURL=friend.service.js.map