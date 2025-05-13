import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';


@Module({
  imports: [
  ConfigModule.forRoot(),
  JwtModule.register({
    global : true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '24h' },
  }),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    database: 'chatapp',
    synchronize : true,
    autoLoadEntities : true,
  }),
  MailerModule.forRoot({
    transport: {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      }
  }),
  AuthModule,
  ChatModule,
  MessageModule],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
