import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { outlook } from './config/outlook';
import axios from 'axios';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      configService.get<string>('CORS_ORIGIN'),
    ],
    credentials: true,
  });

  const url = configService.getOrThrow('PLUGS_SERVICE_INITIALIZE_URL');
  try {
    const response = await axios.post(url, outlook);
    if (response.status !== 201) {
      console.error(`Failed to initialize service: ${response.statusText}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('Failed to send service config to plugs microservice', error);
    process.exit(1);
  }

  await app.listen(configService.getOrThrow<number>('PORT'));
}
bootstrap();
