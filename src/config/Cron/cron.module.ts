import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from 'src/routes/task/task.module';

@Module({
  imports: [ScheduleModule.forRoot(), TaskModule],
  providers: [CronService],
  controllers: [],
})
export class CronModule {}
