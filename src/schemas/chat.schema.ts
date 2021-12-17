import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { User } from './user.schema';
import { ChatMessage } from './chat-message.schema';

export type ChatDocument = Chat & mongoose.Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  user1: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  user2: User;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'ChatMessage',
  })
  content: ChatMessage[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
