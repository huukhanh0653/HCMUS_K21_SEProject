import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const protoDir = join(__dirname, '../src/proto');
  const grpcURL = process.env.GRPC_URL;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: [
          'server',
          'role',
          'server_member',
          'channel',
          'channel_member',
        ],
        protoPath: [
          join(protoDir, 'server.proto'),
          join(protoDir, 'role.proto'),
          join(protoDir, 'server_member.proto'),
          join(protoDir, 'channel.proto'),
          join(protoDir, 'channel_member.proto'),
        ],
        url: grpcURL,
      },
    },
  );

  await app.listen();
  console.log('gRPC server running on', grpcURL);
}
bootstrap();
