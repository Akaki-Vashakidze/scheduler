import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base/base.schema";

@Schema()
export class User extends BaseSchema {

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ default: false })
    isActive: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);