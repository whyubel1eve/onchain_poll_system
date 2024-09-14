import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './service/userService';
import { UserController } from './controller/userController';
import { EventController } from './controller/eventController';
import { EventService } from './service/eventService';
import { ApplicationController } from './controller/applicationController';
import { ApplicationService } from './service/applicationService';

@Module({
  imports: [],
  controllers: [
    AppController,
    UserController,
    EventController,
    ApplicationController,
  ],
  providers: [AppService, UserService, EventService, ApplicationService],
})
export class AppModule {}
