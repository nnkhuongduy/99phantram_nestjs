import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { User } from './user.schema';
import { ChatMessage, ChatMessageSchema } from './chat-message.schema';

export type ChatDocument = Chat &
  mongoose.Document & { createdAt: string; updatedAt: string };

@Schema({ timestamps: true })
export class Chat {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  user1: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  user2: string;

  @Prop({
    type: [ChatMessageSchema],
    default: [],
    ref: 'ChatMessage',
  })
  content: ChatMessage[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
