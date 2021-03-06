import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './routes/user/user.module';
import { DataBaseModule } from './dataBase/data-base.module';
import { TaskModule } from './routes/task/task.module';
import { AuthModule } from './routes/auth/auth.module';

@Module({
  imports: [UserModule, DataBaseModule, TaskModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
