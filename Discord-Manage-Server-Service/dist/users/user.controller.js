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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_dto_1 = require("./user.dto");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async createUser(body, res) {
        try {
            const user = await this.userService.createUser(body);
            return res.status(common_1.HttpStatus.CREATED).json(user);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
    async searchUsers(username, res) {
        try {
            const user = await this.userService.searchUsers(username);
            return res.status(common_1.HttpStatus.OK).json(user);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.NOT_FOUND).json({ message: err.message });
        }
    }
    async getAllUsers(res) {
        try {
            const users = await this.userService.getAllUsers();
            return res.status(common_1.HttpStatus.OK).json(users);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
    async updateUser(username, body, res) {
        try {
            const result = await this.userService.updateUser(username, body);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
    async deleteUser(username, res) {
        try {
            const result = await this.userService.deleteUser(username);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: err.message });
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, common_1.Get)(':username'),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "searchUsers", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Put)(':username'),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)(':username'),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map