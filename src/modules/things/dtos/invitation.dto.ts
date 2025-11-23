import { IsDate, IsNumber, IsOptional, IsString, Matches } from "class-validator";

export class invitationDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'Time must be in HH:MM format',
    })
    start: string;
    
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'Time must be in HH:MM format',
    })
    end: string;

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