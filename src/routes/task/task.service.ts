import { Model } from 'mongoose';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TaskCreateDTO } from './dto/task.dto';
import { Task } from 'src/interfaces/task.interface';
import * as dayjs from 'dayjs';
import { Etask } from 'src/enums/task.enum';

@Injectable()
export class TaskService {
  constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) {}

  // Search all task
  async getTasks(): Promise<Task[]> {
    const tasks = await this.taskModel.find();
    if (!tasks) throw new ForbiddenException('there is no task yet');
    const tasksAll = await this.atrasadaStatus(tasks);
    return tasksAll;
  }

  // Search task for ID user
  async getTask(taskID: string): Promise<Task[]> {
    const task = await this.taskModel.find({
      usuario: taskID,
    });
    if (!task) throw new ForbiddenException('user does not exist');
    const tasksAll = await this.atrasadaStatus(task);
    return tasksAll;
  }

  // Search task for ID user and status
  async getTaskStatus(taskID: string, status: number): Promise<Task[]> {
    const taskStatus = await this.taskModel.find({
      usuario: taskID,
    });
    if (!taskStatus)
      throw new ForbiddenException('an error has occurred, please try again');
    const tasksAll = await this.updateStatus(taskStatus, status);
    return tasksAll;
  }

  async createTask(createTaskID: TaskCreateDTO): Promise<Task> {
    const taskNew = new this.taskModel(createTaskID);
    if (!taskNew)
      throw new ForbiddenException('an error has occurred, please try again');
    await taskNew.save();
    return taskNew;
  }

  async deleteTask(taskID: string): Promise<Task> {
    const taskDelete = await this.taskModel.findByIdAndDelete(taskID);
    if (!taskDelete)
      throw new ForbiddenException('an error has occurred, please try again');
    return taskDelete;
  }

  async updateTask(taskID: string, createTaskID: TaskCreateDTO): Promise<Task> {
    const taskUpdate = await this.taskModel.findByIdAndUpdate(
      taskID,
      createTaskID,
      { new: true },
    );
    if (!taskUpdate)
      throw new ForbiddenException('an error has occurred, please try again');
    return taskUpdate;
  }

  async checkTask(taskID: string) {
    const task = await this.taskModel.findById(taskID);
    const timely = dayjs().diff(dayjs(task.fechaLimite));

    if (timely <= 0) {
      task.estado = Etask.realizado;
    } else {
      task.estado = Etask['realizado tarde'];
    }

    await task.save();
    const neww = task.estado;
    console.log(neww);
    return neww;
  }

  // check task status as "atrasada"
  atrasadaStatus = async (atrasada) => {
    const variables = [...atrasada];
    variables.forEach((esperando, index) => {
      const timely = dayjs().diff(dayjs(esperando.fechaLimite));
      if (esperando.estado == Etask.pendiente) {
        if (timely > 0) {
          variables[index].estado = Etask.atrasado;
        }
      }
    });

    return variables;
  };

  updateStatus = async (atrasada, status) => {
    const variables = [...atrasada];
    let loquesea = [];
    variables.forEach((esperando, index) => {
      const timely = dayjs().diff(dayjs(esperando.fechaLimite));
      if (esperando.estado == Etask.pendiente) {
        if (timely > 0) {
          variables[index].estado = Etask.atrasado;
        }
      }
      if (variables[index].estado == status) {
        loquesea.push(variables[index]);
      }
    });

    return loquesea;
  };
}
