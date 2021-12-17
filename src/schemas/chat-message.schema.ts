import * as mongoose from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export enum ChatMessageType {
  TEXT,
  REQUEST_PAYMENT,
  CONFIRM_PAYMENT,
  CONFIRM_RECEIVED,
  RATED,
}

export type ChatMessageDocument = ChatMessage & mongoose.Document;

@Schema({ timestamps: true })
export class ChatMessage {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  sender: string;

  @Prop({ default: false })
  seen: boolean;

  @Prop({ default: '' })
  content: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supply',
  })
  supplyId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  })
  orderId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rating',
  })
  ratingId: string;

  @Prop({
    enum: Object.keys(ChatMessageType).filter((key) => typeof key === 'number'),
    default: 0,
  })
  messageType: ChatMessageType;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
