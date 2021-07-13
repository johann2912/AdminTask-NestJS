import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from 'src/config/jwt/jwt.module';
import { TaskSchema } from 'src/schemas/task.schema';
import { UserSchema } from 'src/schemas/user.schema';
import { PDFService } from './generateReport/genarePDF.service';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { JwtSchema } from 'src/schemas/jwt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Task', schema: TaskSchema },
      { name: 'User', schema: UserSchema },
      { name: 'JwtSchema', schema: JwtSchema },
    ]),
    JwtModule,
    Reflector,
  ],
  providers: [TaskService, PDFService],
  controllers: [TaskController],
})
export class TaskModule {}
