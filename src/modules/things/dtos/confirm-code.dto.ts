import { IsEmail, IsString } from "class-validator";

export class ConfirmCodeDto {
    @IsEmail()
    email: string;

    @IsString()
    code: string;
}