import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// Load biến môi trường từ file .env
dotenv.config();

async function bootstrap() {
  const protoDir =
    process.env.NODE_ENV === 'prod'
      ? join(__dirname, 'proto')
      : join(__dirname, '../src/proto');

  const grpcPort = process.env.PORT || '8084';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
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
          join(protoDir, 'user.proto'),
          join(protoDir, 'friend.proto'),
          join(protoDir, 'server.proto'),
          join(protoDir, 'role.proto'),
          join(protoDir, 'server_member.proto'),
          join(protoDir, 'channel.proto'),
          join(protoDir, 'channel_member.proto'),
        ],
        url: `0.0.0.0:${grpcPort}`,
      },
    },
  );

  await app.listen();
  console.log(`gRPC server running on port ${grpcPort}`);
}
bootstrap();
