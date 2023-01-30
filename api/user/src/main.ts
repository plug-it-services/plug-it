import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.use(cookieParser());
  app.enableCors({
    origin: ["http://localhost:3000", "http://localhost:3001", configService.get<string>('CORS_ORIGIN')],
    credentials: true,
  });

  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
