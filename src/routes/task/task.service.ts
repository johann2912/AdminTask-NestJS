import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TaskCreateDTO } from './dto/task.dto';
import { Task } from 'src/interfaces/task.interface';

@Injectable()
export class TaskService {
  constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) {}

  // Search all task
  async getTasks(): Promise<Task[]> {
    const tasks = await this.taskModel.find();
    return tasks;
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
}
