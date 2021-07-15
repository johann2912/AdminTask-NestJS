import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TaskService } from 'src/routes/task/task.service';

@Injectable()
export class CronService {
  constructor(private readonly taskService: TaskService) {}

  private readonly logger = new Logger('Cron');

  @Cron('0 15 15 1/2 * *')
  hideCompleted() {
    this.logger.log(
      'La tarea que se ha marcado ya tiene mucho tiempo, esta misma sera ocultada',
    );
    this.taskService.twoDaysLater();
  }
}
