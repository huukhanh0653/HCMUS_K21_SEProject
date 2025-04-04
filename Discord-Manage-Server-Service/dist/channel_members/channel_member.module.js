"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelMemberModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const channel_member_entity_1 = require("./channel_member.entity");
const channel_entity_1 = require("../channels/channel.entity");
const channel_member_service_1 = require("./channel_member.service");
const channel_member_controller_1 = require("./channel_member.controller");
const user_module_1 = require("../users/user.module");
let ChannelMemberModule = class ChannelMemberModule {
};
exports.ChannelMemberModule = ChannelMemberModule;
exports.ChannelMemberModule = ChannelMemberModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([channel_member_entity_1.ChannelMember, channel_entity_1.Channel]), user_module_1.UserModule],
        providers: [channel_member_service_1.ChannelMemberService],
        controllers: [channel_member_controller_1.ChannelMemberController],
        exports: [channel_member_service_1.ChannelMemberService],
    })
], ChannelMemberModule);
//# sourceMappingURL=channel_member.module.js.map