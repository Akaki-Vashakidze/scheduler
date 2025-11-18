import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class RequestContact {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  requester?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  contact?: Types.ObjectId;
}

export const RequestContactSchema = SchemaFactory.createForClass(RequestContact);