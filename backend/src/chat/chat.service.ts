import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}

  async create(createChatDto: CreateChatDto) {
    const { senderId, receiverId } = createChatDto;

    try {
      // Check for existing chat using array operators
      const existingChat = await this.chatRepository.findOne({
        where: {
          members: [senderId, receiverId] as any, // TypeORM array contains
        },
      });

      if (existingChat) {
        return {
          status: HttpStatus.CONFLICT,
          message: 'Chat already exists',
          data: existingChat,
        };
      }

      // Create new chat
      const newChat = this.chatRepository.create({
        members: [senderId, receiverId], // Proper array assignment
      });

      const savedChat = await this.chatRepository.save(newChat);

      return {
        status: HttpStatus.CREATED,
        message: 'Chat created successfully',
        data: savedChat,
      };
    } catch (error) {
      console.error('Chat creation error:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to create chat',
        error: error.message,
      };
    }
  }

  // src/chat/chat.service.ts
  async findUserChats(userId: string) {
    try {
      // Option 1: Using query builder with proper array syntax
      const chats = await this.chatRepository
        .createQueryBuilder('chat')
        .where(':userId = ANY(chat.members)', { userId })
        .getMany();

      return {
        status: HttpStatus.OK,
        data: chats,
      };
    } catch (error) {
      console.error('Database error:', error);
      throw new InternalServerErrorException('Failed to fetch chats');
    }
  }

  async findOneChat(currentUserId: string, otherUserId: string) {
    try {
      // Find chat containing exactly these two users
      const chat = await this.chatRepository
        .createQueryBuilder('chat')
        .where(`chat.members LIKE :user1`, { user1: `%${currentUserId}%` })
        .andWhere(`chat.members LIKE :user2`, { user2: `%${otherUserId}%` })
        .getOne();

      if (!chat) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'No chat found between these users',
        };
      }

      return {
        status: HttpStatus.OK,
        data: chat,
      };
    } catch (error) {
      console.error('Error finding chat:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to find chat',
        error: error.message,
      };
    }
  }
}
