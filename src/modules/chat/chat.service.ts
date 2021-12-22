import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ChatMessage, ChatMessageType } from 'src/schemas/chat-message.schema';
import { Chat, ChatDocument } from 'src/schemas/chat.schema';
import { UserDocument } from 'src/schemas/user.schema';
import { StartChatDto } from '../client/chat/dtos/start-chat.dto';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async startChat(body: StartChatDto, sender: UserDocument) {
    const chat = await this.chatModel.findOne({
      $or: [
        { user1: sender._id, user2: body.receiverId },
        { user2: sender._id, user1: body.receiverId },
      ],
    });

    const chatMessage = new ChatMessage();

    chatMessage.sender = sender._id;
    chatMessage.content = body.message;
    chatMessage.messageType = ChatMessageType.TEXT;

    if (chat) {
      chat.content.push(chatMessage);

      await chat.save();

      return chat;
    }

    const newChat = await this.chatModel.create({
      user1: sender._id,
      user2: body.receiverId,
      content: [chatMessage],
    });

    return newChat;
  }

  async getChats(user: UserDocument) {
    const chats = await this.chatModel
      .find({
        $or: [{ user1: user._id }, { user2: user._id }],
      })
      .populate('user1')
      .populate('user2');

    return chats.map((chat: ChatDocument) => {
      const targetUser =
        (chat.user1 as any)._id === user._id ? chat.user2 : (chat.user1 as any);
      return {
        id: chat._id,
        user: {
          id: targetUser.id,
          firstName: targetUser.firstName,
          lastName: targetUser.lastName,
          avatar: targetUser.avatar,
        },
        lastMessage: chat.content[chat.content.length - 1],
        unseens: 0,
        createdOn: chat.createdAt,
        modifiedOn: chat.updatedAt,
      };
    });
  }
}
