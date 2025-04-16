import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const protoDir = join(__dirname, '../src/proto');
  const grpcURL = process.env.GRPC_URL;
  const port = process.env.HTTP_PORT || 8084;

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Server Management API')
    .setDescription('API for managing servers, roles, members, and channels')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ['server', 'role', 'server_member', 'channel', 'channel_member'],
      protoPath: [
        join(protoDir, 'server.proto'),
        join(protoDir, 'role.proto'),
        join(protoDir, 'server_member.proto'),
        join(protoDir, 'channel.proto'),
        join(protoDir, 'channel_member.proto'),
      ],
      url: grpcURL,
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);
  console.log('Server running on port', port);
}
bootstrap();
