import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('message')
@UseGuards(AuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto , @Req() req ) {
    return this.messageService.create(createMessageDto , req.user.id);
  }

  @Get(':chatId')
  findAll(@Param(":chatId") chatId : string) {
    return this.messageService.findAll(chatId);
  }

  
}
