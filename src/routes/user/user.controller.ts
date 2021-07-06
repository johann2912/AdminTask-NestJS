import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Res,
  Body,
  Param,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UserCreateDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/create')
  createUser() {
    return 'creando usuario';
  }

  @Get('/')
  getUsers() {
    return 'listar todos los usuario';
  }

  @Get('/:userId')
  getUser() {
    return 'listar un solo usuario';
  }

  @Delete('/delete/:userId')
  deleteUser() {
    return 'Eliminar un usuario';
  }

  @Put('/update/:userId')
  updateUser() {
    return 'Editar un usuario';
  }
}
