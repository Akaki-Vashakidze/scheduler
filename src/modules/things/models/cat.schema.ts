import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from './base/base.schema';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type CatDocument = Cat & Document;

@Schema()
export class Cat extends BaseSchema{
  @Prop({ required: true })
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}

export const CatSchema =
  SchemaFactory.createForClass(Cat).plugin(mongoosePaginate)

