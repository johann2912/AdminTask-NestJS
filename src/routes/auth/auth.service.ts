import { User } from 'src/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Ijwt } from 'src/interfaces/jwt.interface';
import { Jwt } from 'src/config/jwt/jwt.service';
import {
  NotFoundException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private authModel: Model<User>,
    @InjectModel('JwtSchema') private tokenModel: Model<Ijwt>,
    private configService: ConfigService,
    private readonly jwtService: Jwt,
  ) {}

  async logIn(email: string, password: string) {
    const user = await this.authModel
      .findOne({
        email: email,
      })
      .select('password _id')
      .lean();
    if (!user)
      throw new NotFoundException('credentials error, try again later');
    const success = bcrypt.compareSync(password, user.password);
    if (!success) throw new ForbiddenException('Wrong Credentials');

    const tokens = await this.jwtService.createToken(user._id);
    const seGenero = await this.compare(tokens, user._id);
    if (!seGenero) {
      const token = await this.tokenModel.create({
        id: user._id,
        token: tokens.accessToken,
        refresh: tokens.refreshToken,
      });
      token.save();
    }

    return tokens;
  }

  async compare(req, id) {
    const validate = await this.tokenModel.findOne({ id });
    if (validate != null) {
      await this.tokenModel.updateOne(
        { id },
        { token: req.accessToken, refresh: req.refreshToken },
      );
      return true;
    }
    return false;
  }

  async logOut(id) {
    await this.tokenModel.deleteOne({ id: id.user });
    return {
      message: 'user deleted successfully',
    };
  }

  async refresh(tokenid: string) {
    const data = tokenid && tokenid.split(' ')[1];
    const token = await this.tokenModel.findOne({ refresh: data });
    console.log(token);

    if (!token) throw new ForbiddenException('the token does not exist');
    const tokenRefresh = await this.jwtService.refreshToken(data);
    return tokenRefresh;
  }
}
