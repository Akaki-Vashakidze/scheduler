import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base/base.schema";
import mongoose from "mongoose";

@Schema()
export class Schedule extends BaseSchema {

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
    description: string;

    @Prop({ required: false })
    approved: boolean;

    @Prop({ required: false })
    active: boolean;

    @Prop({ required: false })
    updated: boolean;

    @Prop({ required: false })
    canceled: boolean;

    @Prop({ required: false })
    reminder: boolean;

}
export const ScheduleSchema = SchemaFactory.createForClass(Schedule);