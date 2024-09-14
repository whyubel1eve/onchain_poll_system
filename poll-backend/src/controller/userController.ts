import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/model/user';
import { UserService } from 'src/service/userService';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('createUser')
  createUser(@Body() req: Partial<User>) {
    return this.userService.createUser(req);
  }

  @Post('login')
  login(@Body() req: { address: string }) {
    return this.userService.login(req.address);
  }
}
