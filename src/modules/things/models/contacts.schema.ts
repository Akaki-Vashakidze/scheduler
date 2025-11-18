import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserContacts {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  contact?: Types.ObjectId;

  @Prop({ default: false })
  isFavorite: number;

  @Prop({ default: false })
  isBlocked: number;
}

export const UserContactsSchema = SchemaFactory.createForClass(UserContacts);
