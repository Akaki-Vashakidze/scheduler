import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Schedule } from "../models/schedule.schema";
import { Model } from "mongoose";
import { ScheduleMeetDto } from "../dtos/schedule-meet.dto";
import { ApiResponse } from "src/modules/base/classes/ApiResponse.class";

@Injectable()
export class ScheduleService {

    constructor(@InjectModel(Schedule.name) private scheduleModel: Model<Schedule>) { }

    async add(scheduleData: ScheduleMeetDto, userId: string): Promise<ApiResponse<Schedule>> {
        const approved = scheduleData.invitee == userId ? true : false;
        const newSchedule = new this.scheduleModel({
            ...scheduleData,
            inviter: userId,
            approved,
            active: true,
        });

        const saved = await newSchedule.save();
        return ApiResponse.success(saved);
    }

    async getSchedulesByUser(userId: string): Promise<ApiResponse<Schedule[]>> {
        const schedules = await this.scheduleModel.find({ invitee: userId }).exec();
        return ApiResponse.success(schedules);
    }

    async getScheduleProposed(userId: string): Promise<ApiResponse<Schedule[]>> {
        const schedules = await this.scheduleModel.find({ inviter: userId }).exec();
        return ApiResponse.success(schedules);
    }

    async editScheduleMeeting(scheduleData: ScheduleMeetDto, scheduleMeetId: string): Promise<ApiResponse<Schedule>> {
        const updatedSchedule = await this.scheduleModel.findByIdAndUpdate(scheduleMeetId, { ...scheduleData, updated: true, approved: false }, { new: true }).exec();
        return ApiResponse.success(updatedSchedule);
    }

    async cancelScheduleMeeting(scheduleMeetId: string): Promise<ApiResponse<Schedule>> {
        const updatedSchedule = await this.scheduleModel.findByIdAndUpdate(scheduleMeetId, { canceled: true }, { new: true }).exec();
        return ApiResponse.success(updatedSchedule);
    }

    async removeScheduleMeeting(scheduleMeetId: string): Promise<ApiResponse<null>> {
        await this.scheduleModel.findByIdAndDelete(scheduleMeetId).exec();
        return ApiResponse.success('Schedule successfully deleted');
    }

    async remindScheduleMeeting(scheduleMeetId: string): Promise<ApiResponse<null>> {
        await this.scheduleModel.findByIdAndUpdate(scheduleMeetId, { reminder: true }, { new: true }).exec();
        return ApiResponse.success('Schedule successfully updated');
    }
}