import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guard";
import { UsersService } from "../services/users.service";
import { GetUsersDto } from "../dtos/getUsersDto";
import { Helper } from "../utils/helper";
import { JwtTokenService } from "../services/jwt-token.service";

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
    constructor(private usersService: UsersService, private jwtTokenService: JwtTokenService) { }

    @Post('list')
    async getInvitationsByUser(@Body() getUsersData: GetUsersDto, @Req() req: Request) {
        const userId = Helper.getUserIdFromHeaderToken(req, this.jwtTokenService);
        return this.usersService.getUsers(getUsersData.searchQuery, userId);
    }

    @Post('contact/request/:id')
    async requestContact(@Req() req: Request, @Param('id') contactId: string) {
        const userId = Helper.getUserIdFromHeaderToken(req, this.jwtTokenService);
        return this.usersService.createContactRequest( userId, contactId);
    }

    @Get('contact/requests/received')
    async getMyContactRequests(@Req() req: Request) {
        const userId = Helper.getUserIdFromHeaderToken(req, this.jwtTokenService);
        return this.usersService.getMyContactRequests(userId);
    }

    @Get('contact/requests/sent')
    async getSentContactRequests(@Req() req: Request) {
        const userId = Helper.getUserIdFromHeaderToken(req, this.jwtTokenService);
        return this.usersService.getSentContactRequests(userId);
    }       

    @Delete('contact/request/:id')
    async deleteContactRequests(@Req() req: Request, @Param('id') requestId: string) {
        const userId = Helper.getUserIdFromHeaderToken(req, this.jwtTokenService);
        return this.usersService.deleteContactRequest(userId, requestId);
    }   
}