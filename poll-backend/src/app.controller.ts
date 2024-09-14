import { Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {}

  @Post('generateToken')
  async generateToken() {
    return this.appService.generateToken();
  }

  @Get('ip')
  async getIP(@Req() req: Request) {
    return JSON.stringify(req.ip || req.headers['x-forwarded-for']);
  }
}
