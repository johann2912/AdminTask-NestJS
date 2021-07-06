import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserCreateDTO } from './dto/user.dto';
import { User } from 'src/interfaces/user.interface';

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
    const userNew = new this.userModel(createUserID);
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
