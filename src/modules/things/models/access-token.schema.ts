import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Document } from "mongoose";

@Schema({ versionKey: false, timestamps: true })
export class AccessToken extends Document {
  @Prop({ required: true })
  token: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Types.ObjectId;

  @Prop({ required: true })
  expiryDate: Date;
}

export const AccessTokenSchema = SchemaFactory.createForClass(AccessToken);
