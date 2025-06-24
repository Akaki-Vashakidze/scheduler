import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class smsRes {


    @Prop({ required: false })
    time:Date;

    @Prop({ required: false })
    body: string;

}
export const SmsResSchema = SchemaFactory.createForClass(smsRes);