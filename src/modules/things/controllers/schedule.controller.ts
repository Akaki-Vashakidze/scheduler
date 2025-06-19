import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ScheduleMeetDto } from "../dtos/schedule-meet.dto";
import { ScheduleService } from "../services/schedule.service";
import { AuthGuard } from "../guards/auth.guard";
import { JwtTokenService } from "../services/jwt-token.service";

@Controller('schedule')
@UseGuards(AuthGuard)
export class ScheduleController {
    constructor(private scheduleService: ScheduleService, private jwtTokenService:JwtTokenService) { }

    @Post('add')
    async add(@Body() scheduleData: ScheduleMeetDto, @Req() req: Request) {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];
        const userId = this.jwtTokenService.getUserIdFromToken(token);
        return this.scheduleService.add(scheduleData, userId);
    }

    @Get('list')
    async getSchedulesByUser(@Req() req: Request) {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];
        const userId = this.jwtTokenService.getUserIdFromToken(token);
        console.log(userId)
        return this.scheduleService.getSchedulesByUser(userId);
    }

    @Get('proposed/:id')
    async getScheduleProposed(@Param('id') userId: string) {
        return this.scheduleService.getScheduleProposed(userId);
    }

    @Put('edit/:id')
    async editScheduleMeeting(@Body() scheduleData: ScheduleMeetDto, @Param('id') scheduleMeetId: string) {
        return this.scheduleService.editScheduleMeeting(scheduleData, scheduleMeetId);
    }

    @Post('cancel/:id')
    async cancelScheduleMeeting(@Param('id') scheduleMeetId: string) {
        return this.scheduleService.cancelScheduleMeeting(scheduleMeetId);
    }

    @Post('remind/:id')
    async remindScheduleMeeting(@Param('id') scheduleMeetId: string) {
        return this.scheduleService.remindScheduleMeeting(scheduleMeetId);
    }

    @Delete('remove/:id')
    async removeScheduleMeeting(@Param('id') scheduleMeetId: string) {
        return this.scheduleService.removeScheduleMeeting(scheduleMeetId);
    }   
}