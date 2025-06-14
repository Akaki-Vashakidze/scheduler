
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsController } from './controllers/cats.controller';
import { CatsService } from './services/cats.service';
import MongooseModels from './models';import * as dotenv from 'dotenv'; 
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';

dotenv.config();

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '24h' },
        }),
        MongooseModule.forRoot(process.env.DB_URL!),
        MongooseModule.forFeature(MongooseModels),
    ],
    controllers: [CatsController,AuthController],
    providers: [CatsService, AuthService],
})
export class ThingsModule {
    constructor() {
    }
}