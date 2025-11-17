import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ScheduleMeetDto } from "../dtos/schedule-meet.dto";
import { InvitationService } from "../services/Invitation.service";
import { AuthGuard } from "../guards/auth.guard";
import { JwtTokenService } from "../services/jwt-token.service";

@Controller('invitation')
@UseGuards(AuthGuard)
export class InvitationController {
    constructor(private invitationService: InvitationService, private jwtTokenService:JwtTokenService) { }

    getUserIdFromHeaderToken(req: Request): string {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];
        return this.jwtTokenService.getUserIdFromToken(token);
    }   

    @Post('invite')
    async invite(@Body() scheduleData: ScheduleMeetDto, @Req() req: Request) {
        const userId = this.getUserIdFromHeaderToken(req);
        return this.invitationService.invite(scheduleData, userId);
    }

    @Get('list')
    async getInvitationsByUser(@Req() req: Request) {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];
        const userId = this.jwtTokenService.getUserIdFromToken(token);
        console.log(userId)
        return this.invitationService.getInvitationsByUser(userId);
    }

    @Get('proposed/:id')
    async getInvitationsProposed(@Param('id') userId: string) {
        return this.invitationService.getInvitationsProposed(userId);
    }

    @Put('edit/:id')
    async editInvitation(@Body() scheduleData: ScheduleMeetDto, @Param('id') invitationId: string) {
        return this.invitationService.editInvitation(scheduleData, invitationId);
    }

    @Post('cancel/:id')
    async cancelInvitation(@Param('id') invitationId: string) {
        return this.invitationService.cancelInvitation(invitationId);
    }

    @Post('remind/:id')
    async remindInvitation(@Param('id') invitationId: string) {
        return this.invitationService.remindInvitation(invitationId);
    }

    @Delete('remove/:id')
    async removeInvitation(@Param('id') invitationId: string, @Req() req: Request) {
        const userId = this.getUserIdFromHeaderToken(req);
        return this.invitationService.removeInvitation(userId, invitationId);
    }   
}