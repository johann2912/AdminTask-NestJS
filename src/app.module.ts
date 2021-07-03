import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './routes/user/user.module';
import { DataBaseModule } from './dataBase/data-base.module';

@Module({
  imports: [UserModule, DataBaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
