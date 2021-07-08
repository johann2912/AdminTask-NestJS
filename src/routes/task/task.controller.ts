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
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskCreateDTO } from './dto/task.dto';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

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

  // Buscar tarea por ID de usario
  @Get('/:taskId')
  async getTask(@Param('taskId') taskId) {
    const task = await this.taskService.getTask(taskId);
    if (!task) throw new NotFoundException('Task does not exists');
    return {
      message: 'Successfully Task Search',
      task,
    };
  }

  // Buscar tarea por ID de usuario y Estado
  @Get('/:taskId/:status')
  async getTaskStatus(@Param('taskId') taskId, @Param('status') status) {
    const task = await this.taskService.getTaskStatus(taskId, status);
    if (!task) throw new NotFoundException('Task does not exists');
    return {
      message: 'Successfully Task Search',
      task,
    };
  }

  @Delete('/delete/:taskId')
  async deleteTask(@Param('taskId') taskId) {
    const taskDelete = await this.taskService.deleteTask(taskId);
    if (!taskDelete) throw new NotFoundException('Task does not exists');
    return {
      message: 'Delete task Succesfully',
      task: taskDelete,
    };
  }

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

  @Patch('/check/:id')
  async checkTask(@Param('id') id: string) {
    const cambio = await this.taskService.checkTask(id);
    return cambio;
  }
}
