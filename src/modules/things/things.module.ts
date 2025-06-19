
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import MongooseModels from './models';import * as dotenv from 'dotenv'; 
import { AuthController } from './controllers/auth.controller';
import { ScheduleController } from './controllers/schedule.controller';
import { AuthService } from './services/auth.service';
import { MailService } from './services/mail.service';
import { ScheduleService } from './services/schedule.service';
import { JwtTokenService } from './services/jwt-token.service';

dotenv.config();

@Module({
    imports: [
        MongooseModule.forRoot(process.env.DB_URL!),
        MongooseModule.forFeature(MongooseModels),
    ],
    controllers: [AuthController, ScheduleController],
    providers: [AuthService, MailService, ScheduleService,JwtTokenService],
})
export class ThingsModule {
    constructor() {
    }
}