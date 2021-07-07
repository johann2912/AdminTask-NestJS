import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtSchema } from 'src/schemas/jwt.schema';
import { Jwt } from './jwt.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Tokens', schema: JwtSchema }]),
    ConfigModule,
  ],
  providers: [Jwt],
  exports: [Jwt],
  controllers: [],
})
export class JwtModule {}
