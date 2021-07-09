import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskCreateDTO } from './dto/task.dto';
import { Roles } from 'src/config/decorators/role.decorator';
import { AccessGuard } from 'src/config/guards/guard.guard';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Roles('gerencial')
  @UseGuards(AccessGuard)
  @Post('/create')
  async createTask(@Body() createTaskDTO: TaskCreateDTO) {
    const task = await this.taskService.createTask(createTaskDTO);
    return {
      message: 'Task Successfully Created',
      task,
    };
  }

  @Get('/')
  async getTasks() {
    const tasks = await this.taskService.getTasks();
    if (!tasks) throw new NotFoundException('There us no user in the list');
    return {
      message: 'All list task',
      task: tasks,
    };
  }

  // Search task by user ID
  @Get('/:taskId')
  async getTask(@Param('taskId') taskId) {
    const task = await this.taskService.getTask(taskId);
    if (!task) throw new NotFoundException('Task does not exists');
    return {
      message: 'Successfully Task Search',
      task,
    };
  }

  // Search Task by User ID and Status
  @Get('/:taskId/:status')
  async getTaskStatus(@Param('taskId') taskId, @Param('status') status) {
    const task = await this.taskService.getTaskStatus(taskId, status);
    if (!task) throw new NotFoundException('Task does not exists');
    return {
      message: 'Successfully Task Search',
      task,
    };
  }

  @Roles('gerencial')
  @UseGuards(AccessGuard)
  @Delete('/delete/:taskId')
  async deleteTask(@Param('taskId') taskId) {
    const taskDelete = await this.taskService.deleteTask(taskId);
    if (!taskDelete) throw new NotFoundException('Task does not exists');
    return {
      message: 'Delete task Succesfully',
      task: taskDelete,
    };
  }

  @Roles('gerencial')
  @UseGuards(AccessGuard)
  @Put('/update/:taskId')
  async updateTask(
    @Body() createTaskDTO: TaskCreateDTO,
    @Param('taskId') taskId,
  ) {
    const taskUpdate = await this.taskService.updateTask(taskId, createTaskDTO);
    if (!taskUpdate) throw new NotFoundException('Task does not exist');
    return {
      message: 'Updating Task Succesfuly',
      task: taskUpdate,
    };
  }

  @UseGuards(AccessGuard)
  @Patch('/check/:taskId/:userId')
  async checkTask(
    @Param('taskId') taskId: string,
    @Param('userId') userId: string,
  ) {
    const cambio = await this.taskService.checkTask(taskId, userId);
    return cambio;
  }

  @Post('/reportGerencial')
  async report(@Body('dateInit') dateInit, @Body('dateFin') dateFin) {
    const report = await this.taskService.reportGerencial(dateInit, dateFin);
    return {
      message: 'tasks found in the requested time periodo',
      report,
    };
  }
}
