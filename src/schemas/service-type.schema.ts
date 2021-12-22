import * as mongoose from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

export enum ServiceTypeStatus {
  ACTIVE,
  DEACTIVE,
}

export type ServiceTypeDocument = ServiceType & mongoose.Document;

@Schema()
export class ServiceType {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    default: 0,
  })
  status: ServiceTypeStatus;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    default: {},
  })
  value: Record<string, any>;
}

export const ServiceTypeSchema = SchemaFactory.createForClass(ServiceType);
