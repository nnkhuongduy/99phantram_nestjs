import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum LocationLevel {
  PROVINCE,
  WARD,
  BLOCK,
}

export enum LocationStatus {
  NEW,
  ACTIVE,
  ARCHIVED,
}

export type LocationDocument = Location & mongoose.Document;

@Schema()
export class Location {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({
    enum: Object.keys(LocationLevel).filter((key) => typeof key === 'number'),
    default: 0,
  })
  locationLevel: LocationLevel;

  @Prop({
    enum: Object.keys(LocationStatus).filter((key) => typeof key === 'number'),
    default: 0,
  })
  status: LocationStatus;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'Location',
  })
  subLocations: Location[];
}

export const LocationSchema = SchemaFactory.createForClass(Location);
