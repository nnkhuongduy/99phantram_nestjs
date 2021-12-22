import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ClientJwtAuthGuard } from 'src/modules/auth/guards/client-jwt.guard';
import { UserInfoGuard } from 'src/modules/auth/guards/user-info.guard';
import { ChatService } from 'src/modules/chat/chat.service';
import { StartChatDto } from './dtos/start-chat.dto';

@Controller('/api/chat')
export class ClientChatController {
  constructor(private chatService: ChatService) {}

  @Post('start')
  @UseGuards(ClientJwtAuthGuard)
  @UseGuards(UserInfoGuard)
  async startChat(@Body() body: StartChatDto, @Req() req) {
    const chat = await this.chatService.startChat(body, req.user);

    return {
      chatId: chat._id,
    };
  }

  @Get('list')
  @UseGuards(ClientJwtAuthGuard)
  @UseGuards(UserInfoGuard)
  async getChats(@Req() req) {
    return await this.chatService.getChats(req.user);
  }

  @Get('connect/:id')
  @UseGuards(ClientJwtAuthGuard)
  @UseGuards(UserInfoGuard)
  async connectChat(@Param('id') id: string) {}
}
