import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Schedule } from "../models/schedule.schema";
import { Model, ObjectId } from "mongoose";
import { ScheduleDto } from "../dtos/schedule.dto";
import { ApiResponse } from "src/modules/base/classes/ApiResponse.class";

@Injectable()
export class ScheduleService {

    constructor(@InjectModel(Schedule.name) private scheduleModel: Model<Schedule>) { }

    async add(scheduleData: ScheduleDto): Promise<ApiResponse<Schedule>> {
        const newSchedule = new this.scheduleModel(scheduleData);
        const saved = await newSchedule.save();
        return ApiResponse.success(saved);
    }

    async getSchedulesByUser(userId: string): Promise<ApiResponse<Schedule[]>> {
        const schedules = await this.scheduleModel.find({ invitee: userId }).exec();
        return ApiResponse.success(schedules);
    }

}