import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ScheduleDto } from "../dtos/schedule.dto";
import { ScheduleService } from "../services/schedule.service";
import { AuthGuard } from "../guards/auth.guard";
import { ObjectId } from "mongodb";

@Controller('schedule')
@UseGuards(AuthGuard)
export class ScheduleController {
    constructor(private scheduleService: ScheduleService) { }

    @Post('add')
    async add(@Body() scheduleData: ScheduleDto) {
        return this.scheduleService.add(scheduleData);
    }

    @Get('user/:id')
    async getSchedulesByUser(@Param('id') userId: string) {
        return this.scheduleService.getSchedulesByUser(userId);
    }
}