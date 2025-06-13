import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsController } from './controllers/cats.controller';
import { CatsService } from './services/cats.service';
import MongooseModels from './models';

@Module({
    imports: [MongooseModule.forRoot("mongodb+srv://akak1:tbyiTElGlhgl16H2@cluster0.fcpniir.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"),
    MongooseModule.forFeature(MongooseModels),
    ],
    controllers: [CatsController],
    providers: [CatsService],
})
export class ThingsModule {

}
