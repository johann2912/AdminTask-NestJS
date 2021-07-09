import {
  Controller,
  Delete,
  Post,
  NotFoundException,
  Body,
  UseGuards,
  ForbiddenException,
  Get,
  Req,
  Headers,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessGuard } from 'src/config/guards/guard.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/logIn')
  async logIn(@Body('email') email, @Body('password') password) {
    const logged = await this.authService.logIn(email, password);
    if (!logged)
      throw new ForbiddenException('an error occurred with the credentials');
    return {
      message: 'session successfully logged in',
      user: logged,
    };
  }

  @UseGuards(AccessGuard)
  @Delete('/logOut')
  async logOut(@Req() req: Request) {
    const unlogged = await this.authService.logOut(req);
    if (!unlogged)
      throw new NotFoundException('an error occurred try again later');
    return {
      message: 'session closed successfully',
    };
  }

  @Get('/refresh')
  async refreshToken(@Headers('authorization') authorization: string) {
    console.dir(authorization);
    const refresh = await this.authService.refresh(authorization);
    if (!refresh)
      throw new NotFoundException('an error occurred try again later');
    return {
      refresh,
    };
  }
}
