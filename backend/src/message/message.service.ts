import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly chatRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto, senderId : string) {
    const { text, chatId } = createMessageDto;
    const newMessage = await this.chatRepository.create({
      senderId,
      text,
      chatId,
    });

    try {
      await this.chatRepository.save(newMessage);

      return {
        status: HttpStatus.CREATED,
        data: newMessage,
      };
    } catch (error) {
      console.log(error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: error,
      };
    }
  }

  async findAll(chatId : string) {
    try {
      const messages = await this.chatRepository.find({
        where : {
          chatId 
        }
      })

      return {
        status : HttpStatus.OK,
        data : messages
      }
    } catch (error) {
      console.log(error)
      return {
        status : HttpStatus.INTERNAL_SERVER_ERROR,
        data : error
      }
    }
  }
}
