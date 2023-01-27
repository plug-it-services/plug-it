import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import starton from './config/starton';
import axios from 'axios';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const url = configService.get<string>('PLUGS_SERVICE_INITIALIZE_URL');
  // const response = await axios.post(url, JSON.stringify(starton));
  // if (response.status !== 200) {
  //   throw new Error(`Failed to initialize service: ${response.statusText}`);
  // }

  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
