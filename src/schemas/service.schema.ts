import * as mongoose from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

import { ServiceType } from './service-type.schema';

export enum ServiceStatus {
  ACTIVE,
  EXPIRED,
}

export type ServiceDocument = Service & mongoose.Document;

@Schema({ timestamps: true })
export class Service {
  @Prop({
    type: ServiceType,
    required: true,
  })
  serviceType: ServiceType;

  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    default: {},
  })
  value: Record<string, any>;

  @Prop({
    enum: Object.keys(ServiceStatus).filter((key) => typeof key === 'number'),
    default: 0,
  })
  status: ServiceStatus;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
