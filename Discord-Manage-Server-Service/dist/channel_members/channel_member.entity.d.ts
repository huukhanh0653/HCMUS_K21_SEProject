import { Channel } from '../channels/channel.entity';
import { User } from '../users/user.entity';
export declare class ChannelMember {
    id: string;
    channel_id: string;
    user_id: string;
    created_at: Date;
    channel: Channel;
    user: User;
}
