import { IsString, Matches, MinLength } from "class-validator";

export class ResetPasswordDto {
    @IsString()
    accessToken:string;

    @IsString()
    @MinLength(6)   
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
        message: 'Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, and one number.'
    })
    newPassword:string;
}