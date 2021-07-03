import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        //console.dir({ uri: config.get<string>('MONGO_URI') });
        return {
          uri: config.get<string>('MONGO_URI'),
        };
      },
    }),
  ],
})
export class DataBaseModule {}
