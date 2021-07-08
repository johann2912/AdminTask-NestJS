import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtSchema } from 'src/schemas/jwt.schema';
import { UserSchema } from 'src/schemas/user.schema';
import { Jwt } from './jwt.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'JwtSchema', schema: JwtSchema, collection: 'jwtschemas' },
      { name: 'User', schema: UserSchema },
    ]),
    ConfigModule,
  ],
  providers: [Jwt],
  exports: [Jwt],
  controllers: [],
})
export class JwtModule {}
