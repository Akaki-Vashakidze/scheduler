import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { InvitationArrayDto } from "../dtos/invitation.dto";
import { InvitationDto } from "../dtos/invitation.dto";
import { InvitationService } from "../services/Invitation.service";
import { AuthGuard } from "../guards/auth.guard";
import { Helper } from "../utils/helper";
import { JwtTokenService } from "../services/jwt-token.service";
import { GetInvitationsDto } from "../dtos/getInvitations.dto";
import { getMySentInvitationsDto } from "../dtos/getMySentInvitations.dto";

@Controller('invitation')
@UseGuards(AuthGuard)
export class InvitationController {
    constructor(private invitationService: InvitationService, private jwtTokenService: JwtTokenService) { }

    @Post('invite')
    async invite(@Body() invitationData: InvitationArrayDto, @Req() req: Request) {
        const userId = Helper.getUserIdFromHeaderToken(req, this.jwtTokenService);
        return this.invitationService.invite(invitationData, userId);
    }

    @Post('inviteTeam')
    async inviteTeam(@Body() teamInvitationData: InvitationArrayDto, @Req() req: Request) {
        const userId = Helper.getUserIdFromHeaderToken(req, this.jwtTokenService);
        return this.invitationService.inviteTeam(teamInvitationData, userId);
    }
    
    @Post('mySentInvitations')
    async getMySentInvitations(@Req() req: Request,@Body() getMySentInvitationsData: getMySentInvitationsDto) {
        const userId = Helper.getUserIdFromHeaderToken(req, this.jwtTokenService);
        return this.invitationService.getMySentInvitations(userId, getMySentInvitationsData);
    }

    @Post('list')
    async getInvitationsByUser(@Req() req: Request,@Body() getInvitationsData: GetInvitationsDto) {
        const userId = Helper.getUserIdFromHeaderToken(req, this.jwtTokenService);
        return this.invitationService.getInvitationsByUser(userId, getInvitationsData);
    }

    @Get('proposed/:id')
    async getInvitationsProposed(@Param('id') userId: string) {
        return this.invitationService.getInvitationsProposed(userId);
    }

    @Post('accept/:id')
    async acceptInvitation(@Param('id') invitationId: string) {
        return this.invitationService.acceptInvitation(invitationId);
    }

    @Post('decline/:id')
    async declineInvitation(@Param('id') invitationId: string) {
        return this.invitationService.declinenvitation(invitationId);
    }

    @Put('edit/:id')
    async editInvitation(@Body() invitationData: InvitationDto, @Param('id') invitationId: string) {
        return this.invitationService.editInvitation(invitationData, invitationId);
    }

    @Post('cancel/:id')
    async cancelInvitation(@Param('id') invitationId: string) {
        return this.invitationService.cancelInvitation(invitationId);
    }

    @Post('reactivateMySent/:id')
    async reactivateMySentInvitation(@Param('id') invitationId: string) {
        return this.invitationService.reactivateMySentInvitation(invitationId);
    }

    @Post('remind/:id')
    async remindInvitation(@Param('id') invitationId: string) {
        return this.invitationService.remindInvitation(invitationId);
    }

    @Delete('removeMySent/:id')
    async removeInvitation(@Param('id') invitationId: string, @Req() req: Request) {
        const userId = Helper.getUserIdFromHeaderToken(req, this.jwtTokenService);
        return this.invitationService.removeMySentInvitation(userId, invitationId);
    }   
}