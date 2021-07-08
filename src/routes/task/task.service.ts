import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
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
    const tasksAll = await this.AtrasadaStatus(tasks);
    return tasksAll;
  }

  // Search task for ID user
  async getTask(taskID: string): Promise<Task[]> {
    const task = await this.taskModel.find({
      usuario: taskID,
    });
    return task;
  }

  // Search task for ID user and status
  async getTaskStatus(taskID: string, status: number): Promise<Task[]> {
    const taskStatus = await this.taskModel.find({
      usuario: taskID,
      estado: status,
    });
    return taskStatus;
  }

  async createTask(createTaskID: TaskCreateDTO): Promise<Task> {
    const taskNew = new this.taskModel(createTaskID);
    await taskNew.save();
    return taskNew;
  }

  async deleteTask(taskID: string): Promise<Task> {
    const taskDelete = await this.taskModel.findByIdAndDelete(taskID);
    return taskDelete;
  }

  async updateTask(taskID: string, createTaskID: TaskCreateDTO): Promise<Task> {
    const taskUpdate = await this.taskModel.findByIdAndUpdate(
      taskID,
      createTaskID,
      { new: true },
    );
    return taskUpdate;
  }

  AtrasadaStatus = async (atrasada) => {
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
}
