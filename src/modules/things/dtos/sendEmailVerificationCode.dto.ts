import { IsEmail, IsString } from "class-validator";

export class SendEmailVerificationCodeDto  {
    @IsEmail()
    email: string;
}