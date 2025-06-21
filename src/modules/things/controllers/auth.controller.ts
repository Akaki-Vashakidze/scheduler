import { Body, Controller, Get, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { SignupDto } from "../dtos/signup.dto";
import { LoginDto } from "../dtos/login.dto";
import { RefreshTokenDto } from "../dtos/refreshToken.dto";
import { ChangePasswordDto } from "../dtos/change-password.dto";
import { AuthGuard } from "../guards/auth.guard";
import { ForgotPasswordDto } from "../dtos/forgot-password.dto";
import { ResetPasswordDto } from "../dtos/reset-password.dto";
import mongoose from "mongoose";
import { ConfirmCodeDto } from "../dtos/confirm-code.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signup(@Body() signupData: SignupDto) {
        return this.authService.signup(signupData);
    }

    @Post('login')
    async login(@Body() loginData: LoginDto) {
        return this.authService.login(loginData);
    }

    @Post('sendVerificationCodeEmail')
    async sendVerificationCodeEmail(@Body() {email}) {
        return this.authService.sendVerificationCodeEmail(email);
    }

    @Post('confirmCodeEmail')
    async confirmCodeEmail(@Body() data:ConfirmCodeDto) {
        return this.authService.confirmCodeEmail(data);
    }

    @UseGuards(AuthGuard)
    @Put('change-password')
    async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req) {
        return this.authService.changePassword(req.userId, changePasswordDto.oldPassword, changePasswordDto.newPassword);
    }

    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto.email);
    }

    @Put('reset-password')
    async resetPassword(@Body() resetData: ResetPasswordDto) {
        return this.authService.resetPassword(resetData.accessToken, resetData.newPassword);
    }

    @Get('session')
    async session(@Req() req: any) {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('Authorization header missing or malformed');
        }

        const token = authHeader.replace('Bearer ', '');
        return this.authService.checkAccessToken(token);
    }

    @Post('logout')
    async logout(@Body() userId: mongoose.Schema.Types.ObjectId) {
        return this.authService.logout(userId);
    }
}