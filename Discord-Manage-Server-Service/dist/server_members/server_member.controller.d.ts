import { ServerMemberService } from './server_member.service';
import { ServerMemberDto } from './server_member.dto';
import { Response } from 'express';
export declare class ServerMemberController {
    private readonly serverMemberService;
    constructor(serverMemberService: ServerMemberService);
    addMember(serverId: string, username: string, body: ServerMemberDto, res: Response): Promise<Response<any, Record<string, any>>>;
    removeMember(serverId: string, username: string, res: Response): Promise<Response<any, Record<string, any>>>;
    updateMemberRole(serverId: string, username: string, body: ServerMemberDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getMembers(serverId: string, username: string, res: Response): Promise<Response<any, Record<string, any>>>;
    searchMember(serverId: string, username: string, query: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
