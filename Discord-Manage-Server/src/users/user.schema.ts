import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true, maxlength: 255 })
  username: string;

  @Prop({ required: true, maxlength: 100 })
  password: string;

  @Prop({ unique: true, required: true, maxlength: 255 })
  email: string;

  @Prop({ required: true })
  status: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
