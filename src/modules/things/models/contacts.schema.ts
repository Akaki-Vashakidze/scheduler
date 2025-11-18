import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserContact {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  contact?: Types.ObjectId;

  @Prop({ default: false })
  isFavorite: number;

  @Prop({ default: false })
  isBlocked: number;
}

export const UserContactSchema = SchemaFactory.createForClass(UserContact);
