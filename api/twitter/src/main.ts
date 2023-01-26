import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { twitter } from './config/twitter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const url = configService.getOrThrow('PLUGS_SERVICE_INITIALIZE_URL');
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(twitter),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to initialize service: ${response.statusText}`);
  }

  await app.listen(3000);
}
bootstrap();
