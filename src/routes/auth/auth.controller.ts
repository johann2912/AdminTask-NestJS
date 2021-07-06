import { Controller, Delete, Post } from '@nestjs/common';
import { AuthCreateDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/logIn')
  logIn() {
    return 'Iniciando session';
  }

  @Delete('/logOut')
  logOut() {
    return 'Cerrand session';
  }
}
