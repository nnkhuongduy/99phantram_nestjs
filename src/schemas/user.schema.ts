import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Role } from './role.schema';
import { Location } from './location.schema';

export enum Gender {
  MALE,
  FEMALE,
  OTHER,
}

export enum UserStatus {
  CREATED,
  VERIFIED,
  ARCHIVED,
}

export type UserDocument = User &
  mongoose.Document & { createdAt: string; updatedAt: string };

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({
    default: 0,
  })
  sex: Gender;

  @Prop({ default: '' })
  address: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
  })
  locationProvince: Location | string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
  })
  locationWard: Location | string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
  })
  locationBlock: Location | string;

  @Prop()
  phoneNumber: string;

  @Prop()
  avatar: string;

  @Prop({ type: Role, required: true })
  role: Role;

  @Prop({
    default: 0,
  })
  status: UserStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);
