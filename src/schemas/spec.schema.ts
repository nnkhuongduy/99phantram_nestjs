import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SpecDocument = Spec & mongoose.Document;

@Schema()
export class Spec {
  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  value: string;

  @Prop({ default: false })
  required: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Spec' })
  parent: Spec;
}

export const SpecSchema = SchemaFactory.createForClass(Spec);
