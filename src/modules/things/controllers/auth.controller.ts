import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { SignupDto } from "../dtos/signup.dto";
import { LoginDto } from "../dtos/login.dto";

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
}