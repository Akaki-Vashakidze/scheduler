import { ApiProperty } from "@nestjs/swagger";

export class ApiPage {
    // გვერდი
    @ApiProperty({default: 0})
    page: number;

    // ჩანაწერების რაოდენობა გვერდზე
    @ApiProperty({default: 10})
    size: number;

    // გვერდების ჯამური რაოდენობა
    number: number;

    // ჩანაწერების ჯამური რაოდენობა
    total: number;
}
