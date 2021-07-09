import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Ijwt } from 'src/interfaces/jwt.interface';
import { User } from 'src/interfaces/user.interface';

@Injectable()
export class Jwt {
  constructor(
    @InjectModel('JwtSchema') private readonly tokenModel: Model<Ijwt>,
    @InjectModel('User') private readonly userSchema: Model<User>,
    private configService: ConfigService,
  ) {}

  // Create token
  async createToken(tokenInfo: Ijwt) {
    const accessToken = jwt.sign(
      {
        id: tokenInfo,
      },
      this.configService.get<string>('ACCESS_SECRET'),
      { expiresIn: '3h' },
    );

    const refreshToken = jwt.sign(
      {
        id: tokenInfo,
      },
      this.configService.get<string>('REFRESH_SECRET'),
      { expiresIn: '10h' },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  // Comparate token
  async decodeToken(token: string) {
    const tokens = await this.tokenModel.findOne({ token }).lean();
    //console.dir({ tokens, token });
    if (!tokens) throw new BadRequestException('token invalid');
    const decodedToken: any = jwt.verify(
      token,
      this.configService.get<string>('ACCESS_SECRET'),
    );
    if (!decodedToken || decodedToken == false)
      throw new BadRequestException('an error occurred');
    // Decode token
    return decodedToken.id;
  }

  // Refresh token
  async refreshToken(tokenRefresh: string) {
    const tokens = await this.tokenModel.findOne({ refresh: tokenRefresh });
    if (!tokens) throw new BadRequestException('token invalid');
    const decodedToken: any = jwt.verify(
      tokenRefresh,
      this.configService.get<string>('REFRESH_SECRET'),
    );
    const accessToken = jwt.sign(
      { id: decodedToken.id, rol: decodedToken.rol },
      this.configService.get<string>('ACCESS_SECRET'),
      { expiresIn: '3h' },
    );

    const refreshToken = jwt.sign(
      { id: decodedToken.id, rol: decodedToken.rol },
      this.configService.get<string>('REFRESH_SECRET'),
      { expiresIn: '10h' },
    );

    await this.tokenModel.updateOne(
      { _id: tokens._id },
      { token: accessToken, refresh: refreshToken },
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  //verify user
  async typeRole(id: string) {
    console.dir(id);
    const user = await this.userSchema.findById(id).lean();
    const all = await this.userSchema.find();
    console.dir({ all });
    //console.dir({ tokens, token });
    console.log(user);
    if (!user.rol) throw new BadRequestException('access not allowed');
    let rol = '';
    switch (user.rol) {
      case 0:
        rol = 'asistencial';
        break;
      case 1:
        rol = 'administrativo';
        break;
      case 2:
        rol = 'gerencial';
        break;
    }
    // Decode token
    return rol;
  }
}
