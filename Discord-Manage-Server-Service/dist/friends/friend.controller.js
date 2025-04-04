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
exports.FriendController = void 0;
const common_1 = require("@nestjs/common");
const friend_service_1 = require("./friend.service");
let FriendController = class FriendController {
    friendService;
    constructor(friendService) {
        this.friendService = friendService;
    }
    async addFriend(username, friendUsername, res) {
        try {
            const result = await this.friendService.addFriend(username, friendUsername);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
    async removeFriend(username, friendUsername, res) {
        try {
            const result = await this.friendService.removeFriend(username, friendUsername);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
    async getFriends(username, res) {
        try {
            const friends = await this.friendService.getFriends(username);
            return res.status(common_1.HttpStatus.OK).json(friends);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
    async searchFriend(username, query, res) {
        if (!query || query.trim() === '') {
            return res
                .status(common_1.HttpStatus.BAD_REQUEST)
                .send('Query parameter is required');
        }
        try {
            const friends = await this.friendService.searchFriend(username, query);
            return res.status(common_1.HttpStatus.OK).json(friends);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.NOT_FOUND).json({ message: err.message });
        }
    }
};
exports.FriendController = FriendController;
__decorate([
    (0, common_1.Post)(':friendUsername'),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Param)('friendUsername')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], FriendController.prototype, "addFriend", null);
__decorate([
    (0, common_1.Delete)(':friendUsername'),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Param)('friendUsername')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], FriendController.prototype, "removeFriend", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FriendController.prototype, "getFriends", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Query)('query')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], FriendController.prototype, "searchFriend", null);
exports.FriendController = FriendController = __decorate([
    (0, common_1.Controller)('friends/:username'),
    __metadata("design:paramtypes", [friend_service_1.FriendService])
], FriendController);
//# sourceMappingURL=friend.controller.js.map