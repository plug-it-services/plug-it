import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import axios from 'axios';
import discord from './config/discord';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('bootstrap');

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      configService.getOrThrow<string>('CORS_ORIGIN'),
    ],
    credentials: true,
  });

  const url = configService.getOrThrow('PLUGS_SERVICE_INITIALIZE_URL');
  try {
    const response = await axios.post(url, discord);
    if (response.status !== 201) {
      throw new Error(`Failed to initialize service: ${response.statusText}`);
    }
  } catch (error) {
    logger.log('Failed to send service config to plugs microservice', error);
    process.exit(1);
  }

  await app.listen(configService.getOrThrow<number>('PORT'));
}
bootstrap();
