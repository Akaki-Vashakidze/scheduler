import { IsArray, IsString, IsNotEmpty, ArrayNotEmpty } from "class-validator";

export class CreateTeamDto {
    @IsString()
    @IsNotEmpty({ message: 'Team title is required' }) 
    title: string;

    @IsArray()
    @ArrayNotEmpty({ message: 'A team must have at least one member' })
    @IsString({ each: true })
    members: string[];
}