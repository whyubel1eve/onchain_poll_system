import { PollEvent } from 'src/model/event';
import { EventService } from './../service/eventService';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Token } from 'src/model/token';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('createEvent')
  createEvent(@Body() req: Partial<PollEvent & { tokens: Token[] }>) {
    return this.eventService.createEvent(req);
  }
  @Post('vote')
  vote(@Body() req: Partial<PollEvent>) {
    return this.eventService.vote(req.id);
  }
  @Get('queryAllEvents')
  queryAllEvents() {
    return this.eventService.queryAllEvents();
  }
  @Get('queryEventByCreator')
  queryEventByCreator(@Query() query: any) {
    return this.eventService.queryEventByCreator(query.creator);
  }
}
