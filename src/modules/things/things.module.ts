
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsController } from './controllers/cats.controller';
import { CatsService } from './services/cats.service';
import MongooseModels from './models';import * as dotenv from 'dotenv'; // ⬅️ IMPORT dotenv here

// ️⬇️️ CRITICAL: Call dotenv.config() at the very top to load .env variables
dotenv.config();

@Module({
    imports: [
        MongooseModule.forRoot(process.env.DB_URL!),
        MongooseModule.forFeature(MongooseModels),
    ],
    controllers: [CatsController],
    providers: [CatsService],
})
export class ThingsModule {
    constructor() {
    }
}