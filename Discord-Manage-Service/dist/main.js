"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
dotenv.config();
async function bootstrap() {
    const protoDir = process.env.NODE_ENV === 'prod'
        ? (0, path_1.join)(__dirname, 'proto')
        : (0, path_1.join)(__dirname, '../src/proto');
    const grpcPort = process.env.PORT || '8084';
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.GRPC,
        options: {
            package: [
                'user',
                'friend',
                'server',
                'role',
                'server_member',
                'channel',
                'channel_member',
            ],
            protoPath: [
                (0, path_1.join)(protoDir, 'user.proto'),
                (0, path_1.join)(protoDir, 'friend.proto'),
                (0, path_1.join)(protoDir, 'server.proto'),
                (0, path_1.join)(protoDir, 'role.proto'),
                (0, path_1.join)(protoDir, 'server_member.proto'),
                (0, path_1.join)(protoDir, 'channel.proto'),
                (0, path_1.join)(protoDir, 'channel_member.proto'),
            ],
            url: `0.0.0.0:${grpcPort}`,
        },
    });
    await app.listen();
    console.log(`gRPC server running on port ${grpcPort}`);
}
bootstrap();
//# sourceMappingURL=main.js.map