import { IsNumber, IsString } from "class-validator";

export class ScheduleDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    time: string;

    @IsNumber()
    duration: number;

    @IsString()
    weekday: string;

    @IsString()
    inviter: string;

    @IsString()
    invitee: string;

}