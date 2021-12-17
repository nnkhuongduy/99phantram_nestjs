import * as mongoose from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

import { User } from './user.schema';
import { ServiceDocument } from './service.schema';
import { Spec } from './spec.schema';
import { CategoryDocument } from './category.schema';
import { LocationDocument } from './location.schema';

export enum SupplyStatus {
  WAITING,
  DECLINED,
  ACTIVE,
  SOLD,
  ARCHIVED,
}

export enum ProductStatus {
  _99,
  _90,
  _80,
  Under80,
}

export type SupplyDocument = Supply & mongoose.Document;

@Schema({ timestamps: true })
export class Supply {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  owner: User;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    min: 1000,
    required: true,
  })
  price: number;

  @Prop({
    required: true,
    maxlength: 500,
  })
  description: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Service',
    default: [],
  })
  services: ServiceDocument[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Spec',
    default: [],
  })
  specs: Spec[];

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ required: true })
  thumbnail: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Category',
    required: true,
  })
  categories: CategoryDocument[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Location',
    required: true,
  })
  locations: LocationDocument[];

  @Prop({ required: true })
  address: string;

  @Prop({ default: '' })
  reason: string;

  @Prop({
    enum: Object.keys(ProductStatus).filter((key) => typeof key === 'number'),
    default: 0,
  })
  productStatus: ProductStatus;

  @Prop({
    enum: Object.keys(SupplyStatus).filter((key) => typeof key === 'number'),
    default: 0,
  })
  status: SupplyStatus;
}

export const SupplySchema = SchemaFactory.createForClass(Supply);
