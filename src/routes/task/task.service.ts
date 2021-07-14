import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task } from 'src/interfaces/task.interface';
import { InjectModel } from '@nestjs/mongoose';
import { TaskCreateDTO } from './dto/task.dto';
import { Etask } from 'src/enums/task.enum';
import { Model } from 'mongoose';
import * as dayjs from 'dayjs';
import { PDFService } from './generateReport/genarePDF.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel('Task') private readonly taskModel: Model<Task>,
    private readonly pdfService: PDFService,
  ) {}

  // Search all task
  async getTasks(): Promise<Task[]> {
    const tasks = await this.taskModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'usuario',
          foreignField: '_id',
          as: 'usuario',
        },
      },
      {
        $unwind: {
          path: '$usuario',
        },
      },
      {
        $match: {
          'usuario.isDeleted': false,
        },
      },
    ]);
    if (!tasks) throw new ForbiddenException('there is no task yet');
    const tasksAll = await this.atrasadaStatus(tasks);
    return tasksAll;
  }

  // Search task for ID user
  async getTask(taskID: string): Promise<Task[]> {
    const task = await this.taskModel
      .find({
        usuario: taskID,
      })
      .populate('usuario');
    if (!task) throw new ForbiddenException('user does not exist');
    const tasksAll = await this.atrasadaStatus(task);
    return tasksAll;
  }

  // Search my task
  async myTask(req): Promise<Task[]> {
    const task = await this.taskModel.find({ usuario: req.user });
    if (!task) throw new ForbiddenException('user does not exist');
    return task;
  }

  // Search task for ID user and status
  async getTaskStatus(userID: string, status: number): Promise<Task[]> {
    const taskStatus = await this.taskModel
      .find({
        usuario: userID,
        estado: status,
      })
      .populate('usuario');
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

  async checkTask(taskID: string, req) {
    const task = await this.taskModel
      .findOne({
        _id: taskID,
        usuario: req.user,
      })
      .populate('usuario');

    if (task == null)
      throw new NotFoundException(
        'the user entered is not the person who has the assigned task',
      );

    const timely = dayjs().diff(dayjs(task.fechaLimite));

    if (timely <= 0) {
      task.estado = Etask.realizado;
    } else {
      task.estado = Etask['realizado tarde'];
    }

    await task.save();
    const completed = task.estado;
    return {
      message: 'the task has been done',
      status: completed,
    };
  }

  async reportGerencial(reqInit, reqFin) {
    const dateI = dayjs(reqInit).toDate();
    const dateF = dayjs(reqFin).toDate();

    const monthHomeworks = await this.taskModel
      .find()
      .where(`createdAt BETWEEN ${dateI} and ${dateF}`);

    let pendiente = 0;
    let atrasado = 0;
    let realizado = 0;
    let realizado_tarde = 0;

    monthHomeworks.forEach((Task, index) => {
      if (Task.estado === Etask.realizado) {
        realizado++;
      }

      if (Task.estado == Etask['realizado tarde']) {
        realizado_tarde++;
      }

      if (Task.estado == Etask.pendiente) {
        const timely = dayjs().diff(dayjs(Task.fechaLimite));
        if (timely > 0) {
          monthHomeworks[index].estado = Etask.atrasado;
          atrasado++;
        } else {
          pendiente++;
        }
      }
    });

    const totalTasks = pendiente + atrasado + realizado + realizado_tarde;

    // porcentaajes totales

    const PorcentPendientes = Math.round((pendiente / totalTasks) * 100);
    const PorcentAtrasadas = Math.round((atrasado / totalTasks) * 100);
    const PorcentRealizados = Math.round((realizado / totalTasks) * 100);
    const PorcentTarde = Math.round((realizado_tarde / totalTasks) * 100);

    const porcentaje = Math.round(
      PorcentPendientes + PorcentAtrasadas + PorcentRealizados + PorcentTarde,
    );

    // Generar Pdf
    return this.pdfService.generarPdf(
      dateI,
      dateF,
      totalTasks,
      pendiente,
      PorcentPendientes,
      atrasado,
      PorcentAtrasadas,
      realizado,
      PorcentRealizados,
      realizado_tarde,
      PorcentTarde,
      porcentaje,
    );
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

  // pending change of pendiente -> atrasado
  updateStatus = async (atrasada, status) => {
    const variables = [...atrasada];
    const dataFuture = [];
    variables.forEach((esperando, index) => {
      const timely = dayjs().diff(dayjs(esperando.fechaLimite));
      if (esperando.estado == Etask.pendiente) {
        if (timely > 0) {
          variables[index].estado = Etask.atrasado;
        }
      }
      if (variables[index].estado == status) {
        dataFuture.push(variables[index]);
      }
    });

    return dataFuture;
  };
}
