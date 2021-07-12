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
  ForbiddenException,
} from '@nestjs/common';
import { Roles } from 'src/config/decorators/role.decorator';
import { AccessGuard } from 'src/config/guards/guard.guard';
import { UserCreateDTO } from './dto/user.dto';
import { UserService } from './user.service';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiCreatedResponse({ description: 'User Registration' })
  @ApiBadRequestResponse({ description: 'fill in the fields correctly' })
  @Post('/create')
  async createUser(@Body() userCreateDTO: UserCreateDTO) {
    const user = await this.userService.createUser(userCreateDTO);
    if (!user) throw new NotFoundException('fill in the fields correctly');

    return {
      message: 'User Successfully Created',
      user,
    };
  }

  @UseGuards(AccessGuard)
  @ApiCreatedResponse({ description: 'all users found successfully' })
  @ApiBadRequestResponse({ description: 'no user found' })
  @ApiBearerAuth()
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
  @ApiOkResponse({ description: 'User found successfully' })
  @ApiBadRequestResponse({ description: 'User does not exists' })
  @ApiBearerAuth()
  @Get('/:userId')
  async getUser(@Param('userId') userId: string) {
    const user = await this.userService.getUser(userId);
    if (!user) throw new ForbiddenException('User does not exists');
    return {
      message: 'Successfully User search',
      user,
    };
  }

  @Roles('gerencial')
  @UseGuards(AccessGuard)
  @ApiOkResponse({ description: 'User delete successfully' })
  @ApiBadRequestResponse({ description: 'User does not exists' })
  @ApiBearerAuth()
  @Delete('/delete/:userId')
  async deleteUser(@Param('userId') userId: string) {
    const userDelete = await this.userService.deleteUser(userId);
    if (!userDelete) throw new NotFoundException('User does not exists');
    return {
      message: 'Delete User Succesfully',
      user: userDelete,
    };
  }

  @Roles('gerencial')
  @UseGuards(AccessGuard)
  @ApiOkResponse({ description: 'User updated successfully' })
  @ApiBadRequestResponse({ description: 'User does not exists' })
  @ApiBearerAuth()
  @Put('/update/:userId')
  async updateUser(
    @Body() userCreateDTO: UserCreateDTO,
    @Param('userId') userId: string,
  ) {
    const userUpdate = await this.userService.updateUser(userId, userCreateDTO);
    if (!userUpdate) throw new NotFoundException('User does not exist');
    return {
      message: 'Updating User Succesfully',
      user: userUpdate,
    };
  }
}
