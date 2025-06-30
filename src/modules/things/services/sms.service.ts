// import { Injectable } from '@nestjs/common';
// import axios from 'axios';
// import { ApiResponse } from 'src/modules/base/classes/ApiResponse.class';

// @Injectable()
// export class SmsService {
//   private apiUrl = 'https://textbelt.com/text';

//   async sendSms(phone: string, message: string) {
//     try {
//       const response = await axios.post(this.apiUrl, {
//         phone,
//         message,
//         key: 'd3ece05e8c5eddca018ba1dfa44914626e380e9aBMQAtfc5IV157iS47ONLMuvDN',
//       });

//       const result = response.data;
//       console.log('asfasf',result)
//       if (result.success) {
//         return ApiResponse.success(response);
//       } else {
//         return { success: false, response:response};
//       }
//     } catch (error) {
//       return { success: false, message: 'Error sending SMS: '};
//     }
//   }
// }

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { ApiResponse } from 'src/modules/base/classes/ApiResponse.class';
import { smsRes } from '../models/smsRes.schema';
import { Model } from 'mongoose';
import { MailService } from './mail.service';

@Injectable()
export class SmsService {
    constructor(@InjectModel(smsRes.name) private smsResModel: Model<smsRes>,public mailSenderService:MailService) { }
    private apiUrl = 'https://textbelt.com/text';
    // Replace with your actual domain where your NestJS app is accessible publicly
    private replyWebhookBaseUrl = 'https://scheduler-api-239do.ondigitalocean.app';

    public async handleSmsReply(body1: any) {
        this.mailSenderService.sendMail('akaki.vashakidze1@gmail.com','Replied SMS',JSON.stringify(body1))
        let body = JSON.stringify(body1)
        let time = new Date()
        return await this.smsResModel.create({ body, time })
    }

    public async test(body1: any) {
        return 'test works'
    }

    public async sendSms(phone: string, message: string) {
        let test = 0;
        try {
            let data4 = {
                phone,
                message,
                // 3cc7233845a5575307519c94f2143580fa82eba1BOWcQJOyQHqcV5q2X8vyCyxgV   new
                // d3ece05e8c5eddca018ba1dfa44914626e380e9aBMQAtfc5IV157iS47ONLMuvDN   old
                key: 'd3ece05e8c5eddca018ba1dfa44914626e380e9aBMQAtfc5IV157iS47ONLMuvDN',
                replyWebhookUrl: `${this.replyWebhookBaseUrl}/sms/handleSmsReply`, // Your endpoint for replies
                // Optional: Add custom data that will be returned in the webhook payload
                // webhookData: 'your_custom_data_here', 
            }
            const response = await axios.post(this.apiUrl, data4);
            const result = response.data;
            console.log(result)
            // return {sentData:data4}
            if (result.success) {
                return ApiResponse.success(response);
            } else {
                // It's better to return a more informative error message from Textbelt
                return { success: false, response: response.data, message: result.error || 'Failed to send SMS' };
            }
        } catch (error) {
            // Log the actual error for debugging
            console.error('Error sending SMS:', error.message);
            return { success: false, message: 'Error sending SMS: ' + error.message };
        }
    }
}