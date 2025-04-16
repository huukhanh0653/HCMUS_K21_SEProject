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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelMember = void 0;
const typeorm_1 = require("typeorm");
const channel_entity_1 = require("../channels/channel.entity");
const user_entity_1 = require("../users/user.entity");
let ChannelMember = class ChannelMember {
    id;
    channel_id;
    user_id;
    created_at;
    channel;
    user;
};
exports.ChannelMember = ChannelMember;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ChannelMember.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ChannelMember.prototype, "channel_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ChannelMember.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ChannelMember.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => channel_entity_1.Channel),
    (0, typeorm_1.JoinColumn)({ name: 'channel_id' }),
    __metadata("design:type", channel_entity_1.Channel)
], ChannelMember.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], ChannelMember.prototype, "user", void 0);
exports.ChannelMember = ChannelMember = __decorate([
    (0, typeorm_1.Entity)('channel_members')
], ChannelMember);
//# sourceMappingURL=channel_member.entity.js.map