import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guard";
import { ScheduleService } from "../services/schedule.service";
import { JwtTokenService } from "../services/jwt-token.service";
import { UsersService } from "../services/users.service";
import { Helper } from "../utils/helper";

@Controller('schedule')
@UseGuards(AuthGuard)
export class ScheduleController {
    constructor(private scheduleService:ScheduleService, private usersService: UsersService, private jwtTokenService: JwtTokenService) { }
    @Get('my')
    async getMyInvitationsAgreed( @Req() req: Request) {
        const userId = Helper.getUserIdFromHeaderToken(req, this.jwtTokenService);
        return this.scheduleService.getMyScheduleInvitations(userId);
    }

    @Get(':id')
    async getInvitationsProposed(@Param('id') subjectuserId: string, @Req() req: Request) {
        const userId = Helper.getUserIdFromHeaderToken(req, this.jwtTokenService);
        return this.scheduleService.getScheduleInvitations(userId, subjectuserId);
    }

    @Get('/team/:id')
    async getMyTeamSchedule(@Param('id') teamId:string, @Req() req: Request) {
        const userId = Helper.getUserIdFromHeaderToken(req, this.jwtTokenService);
        return this.scheduleService.getTeamSchedule(teamId,userId);
    }

}

