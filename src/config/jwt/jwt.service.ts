import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Ijwt } from 'src/interfaces/jwt.interface';

@Injectable()
export class Jwt {
  constructor(
    @InjectModel('JwtSchema') private readonly tokenModel: Model<Ijwt>,
    private configService: ConfigService,
  ) {}

  // Create token
  async createToken(tokenInfo: Ijwt) {
    const accessToken = jwt.sign(
      {
        id: tokenInfo.id,
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
    const tokens = await this.tokenModel.findOne({ token: tokenRefresh });
    if (!tokens) throw new BadRequestException('token invalid');
    const decodedToken: any = jwt.verify(
      tokenRefresh,
      this.configService.get<string>('REFRESH_SECRET'),
    );
    const refreshToken = jwt.sign(
      { id: decodedToken.id, rol: decodedToken.rol },
      this.configService.get<string>('REFRESH_SECRET'),
      { expiresIn: '10h' },
    );

    await this.tokenModel.updateOne(
      { _id: tokens._id },
      { token: tokenRefresh, refres: refreshToken },
    );
    return {
      accessToken: tokenRefresh,
      refreshToken,
    };
  }
}
