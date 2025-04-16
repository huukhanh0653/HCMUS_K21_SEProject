"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerMemberModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const server_member_service_1 = require("./server_member.service");
const server_member_entity_1 = require("./server_member.entity");
const server_entity_1 = require("../servers/server.entity");
const user_module_1 = require("../users/user.module");
const role_module_1 = require("../roles/role.module");
let ServerMemberModule = class ServerMemberModule {
};
exports.ServerMemberModule = ServerMemberModule;
exports.ServerMemberModule = ServerMemberModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([server_member_entity_1.ServerMember, server_entity_1.Server]),
            user_module_1.UserModule,
            role_module_1.RoleModule,
        ],
        providers: [server_member_service_1.ServerMemberService],
        exports: [server_member_service_1.ServerMemberService],
    })
], ServerMemberModule);
//# sourceMappingURL=server_member.module.js.map