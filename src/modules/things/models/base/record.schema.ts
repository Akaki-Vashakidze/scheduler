import { Prop } from "@nestjs/mongoose"
import { RecordState } from "../../../base/enums/record-state.enum"

export class RecordSchema {

    @Prop({ required: true, type: Number, enum: RecordState, default: RecordState.ACTIVE })
    state: number;

    @Prop({ type: Boolean, default: false })
    isDeleted: boolean;

    @Prop({ type: Date, default: new Date() })
    createdAt: Date;

    constructor() {
        this.state = RecordState.ACTIVE
        this.isDeleted = false;
        this.createdAt = new Date();
    }
}