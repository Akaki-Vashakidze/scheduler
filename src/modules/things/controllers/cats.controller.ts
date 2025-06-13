import { Controller, Post, Body, Get } from '@nestjs/common';
import { CatsService } from '../services/cats.service'; 
import { CreateCatDto } from '../dtos/create-cat.dto'; 
import { Cat } from '../models/cat.schema';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto): Promise<Cat> {
    return this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
