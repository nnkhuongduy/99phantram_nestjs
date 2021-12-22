import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Spec, SpecSchema } from './spec.schema';

export enum CategoryLevel {
  PRIMARY,
  SECONDARY,
}

export enum CategoryStatus {
  NEW,
  ACTIVE,
  ARCHIVED,
}

export type CategoryDocument = Category & mongoose.Document;

@Schema()
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({
    default: 0,
  })
  categoryLevel: CategoryLevel;

  @Prop({
    default: 0,
  })
  status: CategoryStatus;

  @Prop({
    type: [SpecSchema],
    default: [],
    ref: 'Spec',
  })
  specs: Spec[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'Category',
  })
  subCategories: (Category | string)[];

  @Prop({ required: true, unique: true })
  slug: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
