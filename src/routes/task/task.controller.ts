import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskCreateDTO } from './dto/task.dto';
import { Roles } from 'src/config/decorators/role.decorator';
import { AccessGuard } from 'src/config/guards/guard.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Roles('gerencial')
  @UseGuards(AccessGuard)
  @ApiOkResponse({ description: 'User created' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiBearerAuth()
  @Post('/create')
  async createTask(@Body() createTaskDTO: TaskCreateDTO) {
    const task = await this.taskService.createTask(createTaskDTO);
    if (!task) throw new BadRequestException('Enter the information correctly');

    return {
      message: 'Task Successfully Created',
      task,
    };
  }

  @ApiOkResponse({ description: 'All list Users' })
  @Get('/')
  async getTasks() {
    const tasks = await this.taskService.getTasks();
    if (!tasks) throw new BadRequestException('There us no user in the list');
    return {
      message: 'All list task',
      task: tasks,
    };
  }

  // Search task by user ID
  @ApiOkResponse({ description: 'Task found successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiBearerAuth()
  @Get('/:taskId')
  async getTask(@Param('taskId') taskId: string) {
    const task = await this.taskService.getTask(taskId);
    if (!task) throw new BadRequestException('Task does not exists');
    return {
      message: 'Successfully Task Search',
      task,
    };
  }

  // Search Task by User ID and Status
  @ApiOkResponse({ description: 'Task found successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiBearerAuth()
  @Get('/:taskId/:status')
  async getTaskStatus(
    @Param('userId') userId: string,
    @Param('status') status: number,
  ) {
    const task = await this.taskService.getTaskStatus(userId, status);
    if (!task) throw new BadRequestException('Task does not exists');
    return {
      message: 'Successfully Task Search',
      task,
    };
  }

  @Roles('gerencial')
  @UseGuards(AccessGuard)
  @ApiOkResponse({ description: 'Task delete successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiBearerAuth()
  @Delete('/delete/:taskId')
  async deleteTask(@Param('taskId') taskId: string) {
    const taskDelete = await this.taskService.deleteTask(taskId);
    if (!taskDelete) throw new BadRequestException('Task does not exists');
    return {
      message: 'Delete task Succesfully',
      task: taskDelete,
    };
  }

  @Roles('gerencial')
  @UseGuards(AccessGuard)
  @ApiOkResponse({ description: 'Task updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiBearerAuth()
  @Put('/update/:taskId')
  async updateTask(
    @Body() createTaskDTO: TaskCreateDTO,
    @Param('taskId') taskId: string,
  ) {
    const taskUpdate = await this.taskService.updateTask(taskId, createTaskDTO);
    if (!taskUpdate) throw new BadRequestException('Task does not exist');
    return {
      message: 'Updating Task Succesfuly',
      task: taskUpdate,
    };
  }

  @UseGuards(AccessGuard)
  @ApiOkResponse({ description: 'Task updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiBearerAuth()
  @Patch('/check/:taskId/:userId')
  async checkTask(
    @Param('taskId') taskId: string,
    @Param('userId') userId: string,
  ) {
    const cambio = await this.taskService.checkTask(taskId, userId);
    return cambio;
  }

  @Roles('gerencial')
  @UseGuards(AccessGuard)
  @ApiOkResponse({ description: 'Generate report successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiBearerAuth()
  @Post('/reportGerencial')
  async report(@Body('dateInit') dateInit, @Body('dateFin') dateFin) {
    const report = await this.taskService.reportGerencial(dateInit, dateFin);
    if (!report) throw new BadRequestException('Enter the dates correctly');

    return {
      message: 'tasks found in the requested time periodo',
      report,
    };
  }
}
