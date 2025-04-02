import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
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
        join(__dirname, 'proto/user.proto'),
        join(__dirname, 'proto/friend.proto'),
        join(__dirname, 'proto/server.proto'),
        join(__dirname, 'proto/role.proto'),
        join(__dirname, 'proto/server_member.proto'),
        join(__dirname, 'proto/channel.proto'),
        join(__dirname, 'proto/channel_member.proto'),
      ],
      url: '0.0.0.0:50051',
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 8084);
}
bootstrap();
