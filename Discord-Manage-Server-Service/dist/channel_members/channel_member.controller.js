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
exports.ChannelMemberController = void 0;
const common_1 = require("@nestjs/common");
const channel_member_service_1 = require("./channel_member.service");
const channel_member_dto_1 = require("./channel_member.dto");
let ChannelMemberController = class ChannelMemberController {
    channelMemberService;
    constructor(channelMemberService) {
        this.channelMemberService = channelMemberService;
    }
    async addMember(channelId, username, body, res) {
        try {
            const result = await this.channelMemberService.addMember(channelId, username, body);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
    async removeMember(channelId, username, memberUsername, res) {
        try {
            const result = await this.channelMemberService.removeMember(channelId, username, memberUsername);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
    async getMembers(channelId, username, res) {
        try {
            const members = await this.channelMemberService.getMembers(channelId, username);
            return res.status(common_1.HttpStatus.OK).json(members);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
    async searchMember(channelId, username, query, res) {
        if (!query || query.trim() === '') {
            return res
                .status(common_1.HttpStatus.BAD_REQUEST)
                .send('Query parameter is required');
        }
        try {
            const members = await this.channelMemberService.searchMember(channelId, query, username);
            return res.status(common_1.HttpStatus.OK).json(members);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.NOT_FOUND).json({ message: err.message });
        }
    }
};
exports.ChannelMemberController = ChannelMemberController;
__decorate([
    (0, common_1.Post)(':username'),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, channel_member_dto_1.ChannelMemberDto, Object]),
    __metadata("design:returntype", Promise)
], ChannelMemberController.prototype, "addMember", null);
__decorate([
    (0, common_1.Delete)(':username/:memberUsername'),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Param)('memberUsername')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ChannelMemberController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Get)(':username'),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ChannelMemberController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Get)('search/:username'),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Query)('query')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ChannelMemberController.prototype, "searchMember", null);
exports.ChannelMemberController = ChannelMemberController = __decorate([
    (0, common_1.Controller)('channels/:channelId/members'),
    __metadata("design:paramtypes", [channel_member_service_1.ChannelMemberService])
], ChannelMemberController);
//# sourceMappingURL=channel_member.controller.js.map