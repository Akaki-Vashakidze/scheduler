import { IsString } from "class-validator";

export class GetUsersDto {
    @IsString()
    searchQuery: string;

}