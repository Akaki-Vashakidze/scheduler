import { Type } from "class-transformer";
import { IsArray, IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, ValidateNested } from "class-validator";

export class InvitationDto {
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    title: string;

    @IsString()
    description: string;

    @IsNumber()
    startMinute: number;

    @IsNumber()
    startHour: number;

    @IsNumber()
    endMinute: number;

    @IsNumber()
    endHour: number;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsString()
    weekday: string;

    @IsOptional()
    @IsNumber()
    urgent: number;

    @IsOptional()
    @IsMongoId({ message: 'invitee must be a valid MongoDB ObjectId' })
    invitee?: string;

    @IsNumber()
    isSingleUse: number;

    @Type(() => Date)
    @IsDate()
    date: Date;
}

export class InvitationArrayDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InvitationDto)
    invitations: InvitationDto[];
}
