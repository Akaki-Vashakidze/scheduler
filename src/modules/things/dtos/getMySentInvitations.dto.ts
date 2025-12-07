import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class getMySentInvitationsDto {
    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsNumber()
    urgent?: number;

    @IsOptional()
    @IsNumber()
    approved?: number;

    @IsOptional()
    @IsNumber()
    active?: number;
}
