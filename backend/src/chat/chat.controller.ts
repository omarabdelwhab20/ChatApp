import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('chat/')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @Get('my-chats')
  getUserChats(@Req() req) {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.chatService.findUserChats(req.user.id);
  }

  @Get('with/:userId')
  getChatWithUser(@Req() req, @Param('userId') otherUserId: string) {
    const currentUserId = req.user.id; // From authentication
    return this.chatService.findOneChat(currentUserId, otherUserId);
  }
}
