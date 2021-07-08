import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserSchema } from 'src/schemas/user.schema';
import { JwtModule } from 'src/config/jwt/jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule,
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
