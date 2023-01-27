import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { twitter } from './config/twitter';
import axios from "axios";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Main');

  const url = configService.getOrThrow('PLUGS_SERVICE_INITIALIZE_URL');
  try {
    const response = await axios.post(url, twitter);
    if (response.status !== 201) {
      throw new Error(`Failed to initialize service: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to send service config to plugs microservice', error);
    process.exit(1);
  }

  await app.listen(3000);
}
bootstrap();