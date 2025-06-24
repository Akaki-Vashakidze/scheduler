import { Controller, Post, Body, Get } from '@nestjs/common';
import { SmsService } from '../services/sms.service';

@Controller('sms')
export class SmsController {
    constructor(private readonly smsService: SmsService) { }

    @Post('send')
    async send(@Body() body: { phone: string; message: string }) {
        return await this.smsService.sendSms(body.phone, body.message);
    }

    @Post('handleSmsReply')
    async handleSmsReply(@Body() data: any) {
        return await this.smsService.handleSmsReply(data)
    }
}
