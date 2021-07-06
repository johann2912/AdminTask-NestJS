import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserCreateDTO } from './dto/user.dto';
import { User } from 'src/interfaces/user.interface';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async getUsers(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }

  async getUser(userID: string): Promise<User> {
    const user = await this.userModel.findById(userID);
    return user;
  }

  async createUser(createUserID: UserCreateDTO): Promise<User> {
    const isEmailExist = await this.userModel.findOne({
      email: createUserID.email,
    });
    if (isEmailExist) {
      throw new NotFoundException('The user has already been registered');
    }

    const userNew = new this.userModel(createUserID);

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(userNew.password, salt);
    console.log(password);

    userNew.password = password;

    await userNew.save();
    return userNew;
  }

  async deleteUser(userID: string): Promise<User> {
    const userDelete = await this.userModel.findByIdAndDelete(userID);
    return userDelete;
  }

  async updateUser(userID: string, createUserID: UserCreateDTO): Promise<User> {
    const userUpdate = await this.userModel.findByIdAndUpdate(
      userID,
      createUserID,
      { new: true },
    );
    return userUpdate;
  }
}
