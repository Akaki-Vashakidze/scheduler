import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class GetInvitationsDto {
    @IsOptional()
    @IsString()
    searchQuery?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    weekday?: string;

    @IsOptional()
    @IsNumber()
    approved?: number;

    @IsOptional()
    @IsNumber()
    urgent?: number;

    @IsOptional()
    @IsNumber()
    active?: number;

    @IsOptional()
    @IsDate()
    specificDate?: Date;
}
