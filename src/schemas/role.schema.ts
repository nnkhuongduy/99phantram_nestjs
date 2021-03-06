import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum RoleLevel {
  CLIENT,
  APP,
  ALL,
}

export type RoleDocument = Role &
  mongoose.Document & { createdAt: string; updatedAt: string };

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true })
  name: string;

  @Prop({
    default: 0,
  })
  roleLevel: RoleLevel;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], default: [], ref: 'Role' })
  selectableRoles: Role[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
