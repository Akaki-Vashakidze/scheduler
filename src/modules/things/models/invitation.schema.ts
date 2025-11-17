import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base/base.schema";
import mongoose from "mongoose";

@Schema()
export class Invitation extends BaseSchema {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    invitee: mongoose.Types.ObjectId;

    @Prop({ required: false })
    weekday: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Inviter', required: true })
    inviter: mongoose.Types.ObjectId;

    @Prop({ required: true })
    duration: number;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    time: string;

    @Prop({ required: true })
    location: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: false })
    approved: number;

    @Prop({ required: false })
    urgent: number;

    @Prop({ required: false })
    specificDate: Date;

    @Prop({ required: false })
    updated: number;

    @Prop({ required: false })
    canceled: number;

    @Prop({ required: false })
    reminder: number;

}
export const InvitationSchema = SchemaFactory.createForClass(Invitation);