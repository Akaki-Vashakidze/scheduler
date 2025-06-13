import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat, CatDocument } from '../models/cat.schema';
import { CreateCatDto } from '../dtos/create-cat.dto';

@Injectable()
export class CatsService {
  constructor(
    @InjectModel(Cat.name) private catModel: Model<CatDocument>,
  ) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const newCat = new this.catModel(createCatDto);
    return newCat.save();
  }

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }
}
