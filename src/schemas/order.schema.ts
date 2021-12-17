import * as mongoose from 'mongoose';
import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';

import { User } from './user.schema';
import { Supply } from './supply.schema';

export enum OrderStatus {
  CREATED,
  CONFIRMING,
  PAID,
  DELIVERED,
  DECLINED,
}

export type OrderDocument = Order & mongoose.Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  buyer: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  seller: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Supply',
  })
  suppy: Supply;

  @Prop({
    default: 0,
  })
  amount: number;

  @Prop({
    enum: Object.keys(OrderStatus).filter((key) => typeof key === 'number'),
    default: 0,
  })
  status: OrderStatus;

  @Prop()
  paidOn: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
