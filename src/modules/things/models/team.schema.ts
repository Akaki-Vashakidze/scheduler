import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Team {

    @Prop({ required: true })
    title: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    })
    leader: Types.ObjectId;

    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: []
    })
    members: Types.ObjectId[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);
