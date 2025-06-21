import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class EmailVerification {

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    code: string;

    @Prop({ required: true })
    expiresAt: string;
    
}
export const EmailVerificationSchema = SchemaFactory.createForClass(EmailVerification);