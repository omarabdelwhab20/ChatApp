import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin : true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials : true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted : true,
  }))
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
