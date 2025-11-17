import { IsNumber, IsString } from "class-validator";

export class ScheduleMeetDto {
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