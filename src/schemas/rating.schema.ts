import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { User } from './user.schema';
import { Supply } from './supply.schema';
import { Order } from './order.schema';

export enum RatingStatus {
  ACTIVE,
  HIDDEN,
  ARCHIVE,
}

export type RatingDocument = Rating & mongoose.Document;

@Schema({ timestamps: true })
export class Rating {
  @Prop({
    type: User,
    ref: 'User',
    required: true,
  })
  user: User;

  @Prop({
    type: User,
    ref: 'User',
    required: true,
  })
  ratingOn: User;

  @Prop({
    type: Supply,
    ref: 'Supply',
    required: true,
  })
  supply: Supply;

  @Prop({
    type: Order,
    ref: 'Order',
    required: true,
  })
  order: Order;

  @Prop({
    default: 0,
  })
  point: number;

  @Prop({ required: true })
  comment: string;

  @Prop({
    default: 0,
  })
  status: RatingStatus;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
