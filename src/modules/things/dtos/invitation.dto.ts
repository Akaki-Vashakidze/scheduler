import { IsNumber, IsString } from "class-validator";

export class invitationDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    time: string;

    @IsNumber()
    duration: number;

    @IsString()
    location: string;

    @IsString()
    weekday: string;

    @IsString()
    invitee: string;

}