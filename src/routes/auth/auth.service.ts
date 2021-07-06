import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthCreateDTO } from './dto/auth.dto';
import { Auth } from 'src/interfaces/auth.interface';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel('Auth') private authModel: Model<Auth>) {}

  async logIn(email: string, password: string) {
    const user = await this.authModel.findOne({
      email: email,
      password: password,
    });
    if (!user) {
      throw new NotFoundException('credentials error, try again later');
    } else {
      password = bcrypt.compareSync(password, this.password);
    }
    return user;
  }
}
