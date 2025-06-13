import { Prop } from "@nestjs/mongoose"
import { ObjectId } from "mongoose"
import { RecordSchema } from "./record.schema"


export class BaseSchema {
    _id: ObjectId;
    
    @Prop({ required: true, type: RecordSchema, default: () => new RecordSchema(), select: true })
    record: RecordSchema
}