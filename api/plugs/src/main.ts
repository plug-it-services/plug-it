import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: ["http://localhost:3000", "http://localhost:3001", configService.get<string>('CORS_ORIGIN')],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configService.getOrThrow<number>('PORT'));
}

bootstrap();
