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
import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthCreateDTO } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({ description: 'User Login' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @Post('/logIn')
  async logIn(@Body() dataUser: AuthCreateDTO) {
    const logged = await this.authService.logIn(
      dataUser.email,
      dataUser.password,
    );
    if (!logged)
      throw new ForbiddenException('an error occurred with the credentials');
    return {
      message: 'session successfully logged in',
      user: logged,
    };
  }

  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'session closed successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid Token' })
  @Delete('/logOut')
  async logOut(@Req() req: Request) {
    const unlogged = await this.authService.logOut(req);
    if (!unlogged)
      throw new NotFoundException('an error occurred try again later');
    return {
      message: 'session closed successfully',
    };
  }

  @ApiOkResponse({ description: 'Successfully Refreshed Token' })
  @ApiUnauthorizedResponse({ description: 'Invalid Token' })
  @Get('/refresh')
  async refreshToken(@Headers('authorization') authorization: string) {
    //console.dir(authorization);
    const refresh = await this.authService.refresh(authorization);
    if (!refresh)
      throw new NotFoundException('an error occurred try again later');
    return {
      refresh,
    };
  }
}
