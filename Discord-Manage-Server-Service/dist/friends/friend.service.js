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
        if (!user)
            throw new Error('User not found');
        if (!friend)
            throw new Error('User wanted to make friend not found');
        if (user.id === friend.id)
            throw new Error('Cannot add self as a friend');
        const existingFriendship = await this.friendRepository.findOne({
            where: { user_id: user.id, friend_id: friend.id },
        });
        if (existingFriendship)
            throw new Error('Already friends');
        const newFriendship = this.friendRepository.create({
            user_id: user.id,
            friend_id: friend.id,
            added_at: new Date(),
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
        return { message: `Added ${friendUsername} to ${username}'s friends list` };
    }
    async removeFriend(username, friendUsername) {
        const user = await this.userService.getUserByUsername(username);
        const friend = await this.userService.getUserByUsername(friendUsername);
        if (!user)
            throw new Error('User not found');
        if (!friend)
            throw new Error('Friend not found');
        const friendship = await this.friendRepository.findOne({
            where: { user_id: user.id, friend_id: friend.id },
        });
        if (!friendship)
            throw new Error('Friend not found in your list');
        await this.friendRepository.delete(friendship.id);
        await this.esClient.delete({
            index: 'friends',
            id: friendship.id,
        });
        return {
            message: `Removed ${friendUsername} from ${username}'s friends list`,
        };
    }
    async getFriends(username) {
        const user = await this.userService.getUserByUsername(username);
        if (!user)
            throw new Error('User not found');
        const friendships = await this.friendRepository.find({
            where: { user_id: user.id },
            relations: ['friend'],
        });
        for (const friendship of friendships) {
            await this.esClient.index({
                index: 'friends',
                id: friendship.id,
                body: {
                    user_username: user.username,
                    friend_username: friendship.friend.username,
                    friend_status: friendship.friend.status,
                    friend_profile_pic: friendship.friend.profile_pic,
                    added_at: friendship.added_at,
                },
            });
        }
        const result = await this.esClient.search({
            index: 'friends',
            body: {
                query: {
                    term: { user_username: user.username },
                },
            },
        });
        const friends = result.hits.hits.map((hit) => ({
            friend_username: hit._source.friend_username,
            friend_status: hit._source.friend_status,
            friend_profile_pic: hit._source.friend_profile_pic,
            added_at: hit._source.added_at,
        }));
        return friends;
    }
    async searchFriend(username, query) {
        const user = await this.userService.getUserByUsername(username);
        if (!user)
            throw new Error('User not found');
        const result = await this.esClient.search({
            index: 'friends',
            body: {
                query: {
                    bool: {
                        filter: [{ term: { user_username: user.username } }],
                        must: [
                            {
                                query_string: {
                                    query: `*${query}*`,
                                    fields: ['friend_username'],
                                },
                            },
                        ],
                    },
                },
            },
        });
        const friends = result.hits.hits.map((hit) => ({
            friend_username: hit._source.friend_username,
            friend_status: hit._source.friend_status,
            friend_profile_pic: hit._source.friend_profile_pic,
            added_at: hit._source.added_at,
        }));
        if (friends.length === 0)
            throw new Error('No friends found matching the query');
        return friends;
    }
};
exports.FriendService = FriendService;
exports.FriendService = FriendService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(friend_entity_1.Friend)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService])
], FriendService);
//# sourceMappingURL=friend.service.js.map