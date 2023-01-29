import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import starton from './config/starton';
import axios from 'axios';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();

  const url = configService.getOrThrow<string>('PLUGS_SERVICE_INITIALIZE_URL');
  try {
    const response = await axios.post(url, starton);
    if (response.status !== 201) {
      throw new Error(`Failed to initialize service: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to send service config to plugs microservice', error);
    process.exit(1);
  }

  await app.listen(configService.getOrThrow<number>('PORT'));
}
bootstrap();
