import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { InvitationArrayDto } from "../dtos/invitation.dto";
import { InvitationService } from "../services/Invitation.service";
import { AuthGuard } from "../guards/auth.guard";
import { Helper } from "../utils/helper";
import { JwtTokenService } from "../services/jwt-token.service";
import { TeamService } from "../services/team.service";
import { CreateTeamDto } from "../dtos/create-team.dto";

@Controller('team')
@UseGuards(AuthGuard)
export class TeamController {
    constructor(private teamService: TeamService, private jwtTokenService: JwtTokenService) { }

    @Post('create')
    async createTeam(@Body() data: CreateTeamDto, @Req() req: Request) {
        const userId = Helper.getUserIdFromHeaderToken(req, this.jwtTokenService);
        return this.teamService.createTeam(userId, data.members, data.title);
    }

    @Get('my-teams')
    async getMyTeams(@Req() req: Request) {
        const userId = Helper.getUserIdFromHeaderToken(req, this.jwtTokenService);
        return this.teamService.getTeamsByUserId(userId);
    }
    
}