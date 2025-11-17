import { IsBoolean, IsDate, IsOptional, IsString } from "class-validator";

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
    @IsBoolean()
    approved?: boolean;

    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @IsOptional()
    @IsDate()
    specificDate?: Date;
}
