"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("./users/user.module");
const friend_module_1 = require("./friends/friend.module");
const server_module_1 = require("./servers/server.module");
const role_module_1 = require("./roles/role.module");
const server_member_module_1 = require("./server_members/server_member.module");
const channel_module_1 = require("./channels/channel.module");
const channel_member_module_1 = require("./channel_members/channel_member.module");
const dotenv = require("dotenv");
dotenv.config();
console.log(process.env.POSTGRES_SINGAPORE_CONNECTION_STRING);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                url: process.env.POSTGRES_SINGAPORE_CONNECTION_STRING,
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
                ssl: { rejectUnauthorized: false },
            }),
            user_module_1.UserModule,
            friend_module_1.FriendModule,
            server_module_1.ServerModule,
            role_module_1.RoleModule,
            server_member_module_1.ServerMemberModule,
            channel_module_1.ChannelModule,
            channel_member_module_1.ChannelMemberModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map