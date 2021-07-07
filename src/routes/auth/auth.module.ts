import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { UserSchema } from 'src/schemas/user.schema';
import { JwtSchema } from 'src/schemas/jwt.schema';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from 'src/config/jwt/jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'JwtSchema', schema: JwtSchema },
    ]),
    ConfigModule,
    JwtModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
