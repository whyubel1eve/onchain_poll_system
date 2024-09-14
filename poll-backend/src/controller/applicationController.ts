import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApplicationService } from 'src/service/applicationService';
import { Application } from 'src/model/application';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('createApplication')
  createApplication(@Body() req: Partial<Application>) {
    return this.applicationService.createApplication(req);
  }
  @Post('handleApplication')
  handleApplication(@Body() req: Partial<Application>) {
    return this.applicationService.handleApplication(req.status, req.id);
  }
  @Get('queryApplication')
  queryApplication(@Query('applicant') applicant: string) {
    return this.applicationService.queryApplication(applicant);
  }
  @Get('queryApplicationByEventId')
  queryApplicationByEventId(@Query() query: any) {
    return this.applicationService.queryApplicationByEventId(
      query.applicant,
      query.event_id,
    );
  }
  @Get('queryApplicationByCreator')
  queryApplicationByCreator(@Query() query: any) {
    return this.applicationService.queryApplicationByCreator(query.creator);
  }
  @Get('queryToken')
  queryToken(@Query() query: any) {
    return this.applicationService.queryToken(query.token_id);
  }
}
