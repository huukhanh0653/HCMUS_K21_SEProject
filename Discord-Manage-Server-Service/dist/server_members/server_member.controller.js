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
exports.ServerMemberController = void 0;
const common_1 = require("@nestjs/common");
const server_member_service_1 = require("./server_member.service");
const server_member_dto_1 = require("./server_member.dto");
let ServerMemberController = class ServerMemberController {
    serverMemberService;
    constructor(serverMemberService) {
        this.serverMemberService = serverMemberService;
    }
    async addMember(serverId, username, body, res) {
        try {
            const result = await this.serverMemberService.addMember(serverId, username, body);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
    async removeMember(serverId, username, res) {
        try {
            const result = await this.serverMemberService.removeMember(serverId, username);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
    async updateMemberRole(serverId, username, body, res) {
        try {
            const result = await this.serverMemberService.updateMemberRole(serverId, username, body);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
    async getMembers(serverId, username, res) {
        try {
            const members = await this.serverMemberService.getMembers(serverId, username);
            return res.status(common_1.HttpStatus.OK).json(members);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
    async searchMember(serverId, username, query, res) {
        if (!query || query.trim() === '') {
            return res
                .status(common_1.HttpStatus.BAD_REQUEST)
                .send('Query parameter is required');
        }
        try {
            const members = await this.serverMemberService.searchMember(serverId, query, username);
            return res.status(common_1.HttpStatus.OK).json(members);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.NOT_FOUND).json({ message: err.message });
        }
    }
};
exports.ServerMemberController = ServerMemberController;
__decorate([
    (0, common_1.Post)(':username'),
    __param(0, (0, common_1.Param)('serverId')),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, server_member_dto_1.ServerMemberDto, Object]),
    __metadata("design:returntype", Promise)
], ServerMemberController.prototype, "addMember", null);
__decorate([
    (0, common_1.Delete)(':username'),
    __param(0, (0, common_1.Param)('serverId')),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ServerMemberController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Put)(':username'),
    __param(0, (0, common_1.Param)('serverId')),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, server_member_dto_1.ServerMemberDto, Object]),
    __metadata("design:returntype", Promise)
], ServerMemberController.prototype, "updateMemberRole", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('serverId')),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ServerMemberController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Param)('serverId')),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Query)('query')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ServerMemberController.prototype, "searchMember", null);
exports.ServerMemberController = ServerMemberController = __decorate([
    (0, common_1.Controller)('servers/:serverId/members'),
    __metadata("design:paramtypes", [server_member_service_1.ServerMemberService])
], ServerMemberController);
//# sourceMappingURL=server_member.controller.js.map