import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  someProtectedRoute(@Req() req) {
    return { message: 'This is a protected route', userId: req.userId}
  }


  getHello(): string {
    return this.appService.getHello();
  }
}
