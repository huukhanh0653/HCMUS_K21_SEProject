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
exports.ChannelController = void 0;
const common_1 = require("@nestjs/common");
const channel_service_1 = require("./channel.service");
const channel_dto_1 = require("./channel.dto");
let ChannelController = class ChannelController {
    channelService;
    constructor(channelService) {
        this.channelService = channelService;
    }
    async createChannel(serverId, username, body, res) {
        try {
            const channel = await this.channelService.createChannel(serverId, body, username);
            return res.status(common_1.HttpStatus.CREATED).json(channel);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
    async getChannels(serverId, channelName, username, res) {
        try {
            const channel = await this.channelService.getChannels(username, serverId, channelName);
            return res.status(common_1.HttpStatus.OK).json(channel);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.NOT_FOUND).json({ message: err.message });
        }
    }
    async getChannelsByServer(serverId, username, res) {
        try {
            const channels = await this.channelService.getChannelsByServer(serverId, username);
            return res.status(common_1.HttpStatus.OK).json(channels);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
    async updateChannel(channelId, username, body, res) {
        try {
            const result = await this.channelService.updateChannel(channelId, body, username);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
    async deleteChannel(channelId, username, res) {
        try {
            const result = await this.channelService.deleteChannel(channelId, username);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
};
exports.ChannelController = ChannelController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('serverId')),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, channel_dto_1.ChannelDto, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "createChannel", null);
__decorate([
    (0, common_1.Get)(':channelName'),
    __param(0, (0, common_1.Param)('serverId')),
    __param(1, (0, common_1.Param)('channelName')),
    __param(2, (0, common_1.Param)('username')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getChannels", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('serverId')),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getChannelsByServer", null);
__decorate([
    (0, common_1.Put)(':channelId'),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "updateChannel", null);
__decorate([
    (0, common_1.Delete)(':channelId'),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "deleteChannel", null);
exports.ChannelController = ChannelController = __decorate([
    (0, common_1.Controller)('servers/:serverId/channels/:username'),
    __metadata("design:paramtypes", [channel_service_1.ChannelService])
], ChannelController);
//# sourceMappingURL=channel.controller.js.map