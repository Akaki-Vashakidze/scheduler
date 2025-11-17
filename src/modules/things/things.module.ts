
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import MongooseModels from './models';import * as dotenv from 'dotenv'; 
import { AuthController } from './controllers/auth.controller';
import { InvitationController } from './controllers/invitation.controller';
import { AuthService } from './services/auth.service';
import { MailService } from './services/mail.service';
import { InvitationService } from './services/Invitation.service';
import { JwtTokenService } from './services/jwt-token.service';
import { SmsService } from './services/sms.service';
import { SmsController } from './controllers/sms.controller';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

dotenv.config();

@Module({
    imports: [
        MongooseModule.forRoot(process.env.DB_URL!),
        MongooseModule.forFeature(MongooseModels),
    ],
    controllers: [AuthController, InvitationController,SmsController, UsersController],
    providers: [AuthService, MailService, InvitationService, JwtTokenService, SmsService, UsersService],
})
export class ThingsModule {
    constructor() {
    }
}