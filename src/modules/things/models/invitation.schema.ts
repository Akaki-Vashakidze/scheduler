import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base/base.schema";
import mongoose from "mongoose";
import { IsMilitaryTime } from "class-validator";

@Schema()
export class Invitation extends BaseSchema {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    invitee: mongoose.Types.ObjectId;

    @Prop({ required: false })
    weekday: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    inviter: mongoose.Types.ObjectId;

    @Prop({ required: true })
    startMinute: number;

    @Prop({ required: true })
    startHour: number;

    @Prop({ required: true })
    endMinute: number;

    @Prop({ required: true })
    endMinutesTotal: number;

    @Prop({ required: true })
    startMinutesTotal: number;

    @Prop({ required: true })
    endHour: number;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    location: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: false })
    approved: number;

    @Prop({ required: false })
    urgent: number;

    @Prop({ required: false })
    updated: number;

    @Prop({ required: false })
    canceled: number;

    @Prop({ required: false })
    reminder: number;

    @Prop({ required: true })
    isSingleUse: number;

    @Prop({ required: false })
    date: Date;

}
export const InvitationSchema = SchemaFactory.createForClass(Invitation);