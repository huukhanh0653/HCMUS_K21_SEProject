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
exports.RoleController = void 0;
const common_1 = require("@nestjs/common");
const role_service_1 = require("./role.service");
const role_dto_1 = require("./role.dto");
let RoleController = class RoleController {
    roleService;
    constructor(roleService) {
        this.roleService = roleService;
    }
    async createRole(serverId, body, res) {
        try {
            const role = await this.roleService.createRole(serverId, body);
            return res.status(common_1.HttpStatus.CREATED).json(role);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
    async getRole(serverId, roleId, res) {
        try {
            const role = await this.roleService.getRole(roleId);
            return res.status(common_1.HttpStatus.OK).json(role);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.NOT_FOUND).json({ message: err.message });
        }
    }
    async getRolesByServer(serverId, res) {
        try {
            const roles = await this.roleService.getRolesByServer(serverId);
            return res.status(common_1.HttpStatus.OK).json(roles);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
    async updateRole(serverId, roleId, body, res) {
        try {
            const result = await this.roleService.updateRole(roleId, body);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
    async deleteRole(serverId, roleId, res) {
        try {
            const result = await this.roleService.deleteRole(roleId);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
};
exports.RoleController = RoleController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('serverId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, role_dto_1.RoleDto, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "createRole", null);
__decorate([
    (0, common_1.Get)(':roleId'),
    __param(0, (0, common_1.Param)('serverId')),
    __param(1, (0, common_1.Param)('roleId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "getRole", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('serverId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "getRolesByServer", null);
__decorate([
    (0, common_1.Put)(':roleId'),
    __param(0, (0, common_1.Param)('serverId')),
    __param(1, (0, common_1.Param)('roleId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Delete)(':roleId'),
    __param(0, (0, common_1.Param)('serverId')),
    __param(1, (0, common_1.Param)('roleId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "deleteRole", null);
exports.RoleController = RoleController = __decorate([
    (0, common_1.Controller)('servers/:serverId/roles'),
    __metadata("design:paramtypes", [role_service_1.RoleService])
], RoleController);
//# sourceMappingURL=role.controller.js.map