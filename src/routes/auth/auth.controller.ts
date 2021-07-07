import {
  Controller,
  Delete,
  Post,
  NotFoundException,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AccessGuard } from 'src/config/guards/guard.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/logIn')
  async logIn(@Body('email') email, @Body('password') password) {
    const logged = await this.authService.logIn(email, password);
    return {
      message: 'session successfully logged in',
      user: logged,
    };
  }

  @UseGuards(AccessGuard)
  @Delete('/logOut')
  async logOut(@Body('user') user: string) {
    const unlogged = await this.authService.logOut(user);
    if (!unlogged)
      throw new NotFoundException('an error occurred try again later');
    return {
      message: 'session closed successfully',
    };
  }
}
