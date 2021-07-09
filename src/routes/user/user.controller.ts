import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/config/decorators/role.decorator';
import { AccessGuard } from 'src/config/guards/guard.guard';
import { UserCreateDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/create')
  async createUser(@Body() userCreateDTO: UserCreateDTO) {
    const user = await this.userService.createUser(userCreateDTO);
    return {
      message: 'User Successfully Created',
      user,
    };
  }

  @UseGuards(AccessGuard)
  @Get('/')
  async getUsers() {
    const users = await this.userService.getUsers();
    if (!users) throw new NotFoundException('There is no user in the list');
    return {
      message: 'All list Users',
      user: users,
    };
  }

  @UseGuards(AccessGuard)
  @Get('/:userId')
  async getUser(@Param('userId') userId) {
    const user = await this.userService.getUser(userId);
    if (!user) throw new NotFoundException('User does not exists');
    return {
      message: 'Successfully User search',
      user,
    };
  }

  @Roles('gerencial')
  @UseGuards(AccessGuard)
  @Delete('/delete/:userId')
  async deleteUser(@Param('userId') userId) {
    const userDelete = await this.userService.deleteUser(userId);
    if (!userDelete) throw new NotFoundException('User does not exists');
    return {
      message: 'Delete User Succesfully',
      user: userDelete,
    };
  }

  @Roles('gerencial')
  @UseGuards(AccessGuard)
  @Put('/update/:userId')
  async updateUser(
    @Body() userCreateDTO: UserCreateDTO,
    @Param('userId') userId,
  ) {
    const userUpdate = await this.userService.updateUser(userId, userCreateDTO);
    if (!userUpdate) throw new NotFoundException('User does not exist');
    return {
      message: 'Updating User Succesfully',
      user: userUpdate,
    };
  }
}
