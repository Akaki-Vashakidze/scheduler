import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Contact {
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  user?: Types.ObjectId;

  @Prop()
  email?: string;

  @Prop({ default: false })
  isFavorite: boolean;

  @Prop({ default: false })
  isBlocked: boolean;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

@Schema({ timestamps: true })
export class UserContacts extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId; // the user who owns these contacts

  @Prop({ type: [ContactSchema], default: [] })
  contacts: Contact[];
}

export const UserContactsSchema = SchemaFactory.createForClass(UserContacts);
