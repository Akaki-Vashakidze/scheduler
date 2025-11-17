import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { invitationDto } from "../dtos/invitation.dto";
import { InvitationService } from "../services/Invitation.service";
import { AuthGuard } from "../guards/auth.guard";
import { Helper } from "../utils/helper";
import { JwtTokenService } from "../services/jwt-token.service";
import { GetInvitationsDto } from "../dtos/getInvitations.dto";

@Controller('invitation')
@UseGuards(AuthGuard)
export class InvitationController {
    constructor(private invitationService: InvitationService, private jwtTokenService: JwtTokenService) { }

    @Post('invite')
    async invite(@Body() invitationData: invitationDto, @Req() req: Request) {
        const userId = Helper.getUserIdFromHeaderToken(req, this.jwtTokenService);
        return this.invitationService.invite(invitationData, userId);
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

    @Put('edit/:id')
    async editInvitation(@Body() invitationData: invitationDto, @Param('id') invitationId: string) {
        return this.invitationService.editInvitation(invitationData, invitationId);
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
        const userId = Helper.getUserIdFromHeaderToken(req, this.jwtTokenService);
        return this.invitationService.removeInvitation(userId, invitationId);
    }   
}