import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { SignupDto } from "../dtos/signup.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}     
    
    @Post('signup')
    async signup(@Body() signupData:SignupDto) {
        return this.authService.signup(signupData);
    }
}