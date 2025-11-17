import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guard";
import { UsersService } from "../services/users.service";
import { GetUsersDto } from "../dtos/getUsersDto";

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post('list')
    async getInvitationsByUser(@Body() getUsersData: GetUsersDto,) {
        return this.usersService.getUsers(getUsersData.searchQuery);
    }
}