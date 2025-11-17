import { IsNumber, IsOptional, IsString } from "class-validator";

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

    @IsOptional()
    @IsNumber()
    urgent: number;

    @IsString()
    invitee: string;

}