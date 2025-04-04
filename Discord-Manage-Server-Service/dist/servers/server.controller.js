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
exports.ServerController = void 0;
const common_1 = require("@nestjs/common");
const server_service_1 = require("./server.service");
const server_dto_1 = require("./server.dto");
let ServerController = class ServerController {
    serverService;
    constructor(serverService) {
        this.serverService = serverService;
    }
    async createServer(username, body, res) {
        try {
            const server = await this.serverService.createServer(body, username);
            return res.status(common_1.HttpStatus.CREATED).json(server);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
    async getServer(serverName, username, res) {
        try {
            const servers = await this.serverService.getServers(username, serverName);
            return res.status(common_1.HttpStatus.OK).json(servers);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.NOT_FOUND).json({ message: err.message });
        }
    }
    async getAllServers(username, res) {
        try {
            const servers = await this.serverService.getAllServers(username);
            return res.status(common_1.HttpStatus.OK).json(servers);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
    async updateServer(serverId, username, body, res) {
        try {
            const result = await this.serverService.updateServer(serverId, body, username);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
    async deleteServer(serverId, username, res) {
        try {
            const result = await this.serverService.deleteServer(serverId, username);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
};
exports.ServerController = ServerController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, server_dto_1.ServerDto, Object]),
    __metadata("design:returntype", Promise)
], ServerController.prototype, "createServer", null);
__decorate([
    (0, common_1.Get)(':serverName'),
    __param(0, (0, common_1.Param)('serverName')),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ServerController.prototype, "getServer", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ServerController.prototype, "getAllServers", null);
__decorate([
    (0, common_1.Put)(':serverId'),
    __param(0, (0, common_1.Param)('serverId')),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ServerController.prototype, "updateServer", null);
__decorate([
    (0, common_1.Delete)(':serverId'),
    __param(0, (0, common_1.Param)('serverId')),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ServerController.prototype, "deleteServer", null);
exports.ServerController = ServerController = __decorate([
    (0, common_1.Controller)('servers/:username'),
    __metadata("design:paramtypes", [server_service_1.ServerService])
], ServerController);
//# sourceMappingURL=server.controller.js.map