import { Body, Controller, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { SignupDto } from "../dtos/signup.dto";
import { LoginDto } from "../dtos/login.dto";
import { RefreshTokenDto } from "../dtos/refreshToken.dto";
import { ChangePasswordDto } from "../dtos/change-password.dto";
import { AuthGuard } from "../guards/auth.guard";
import { ForgotPasswordDto } from "../dtos/forgot-password.dto";
import { ResetPasswordDto } from "../dtos/reset-password.dto";

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

    @Post('refresh')
    async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshTokens(refreshTokenDto.refreshToken);
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
    async resetPassword(@Body() resetData:ResetPasswordDto) {
        return this.authService.resetPassword(resetData.resetToken, resetData.newPassword);
    }
}