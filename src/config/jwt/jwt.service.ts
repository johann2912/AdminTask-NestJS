import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Ijwt } from 'src/interfaces/jwt.interface';

@Injectable()
export class Jwt {
  constructor(
    @InjectModel('Tokens') private readonly tokenModel: Model<Ijwt>,
    private configService: ConfigService,
  ) {}

  /*
  ensureToken = async (req) => {
    const authorization = req.headers['authorization'];

    if (!authorization) return { message: 'Inicia session, intenta más tarde' };
    const bearer = authorization.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    req.message = await this.compare(req);

    const decoded = jwt.verify(req.token, process.env.ACCESS_SECRET);
    console.log(decoded);
    //req.id = decoded.id;
  };
  */

  // Create token
  async createToken(Interface: Ijwt) {
    const accessToken = jwt.sign(
      Interface,
      this.configService.get<string>('ACCESS_SECRET'),
      { expiresIn: '3h' },
    );

    const refreshToken = jwt.sign(
      Interface,
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
    const tokens = await this.tokenModel.findOne({ token: token });
    if (!tokens) throw new BadRequestException('token invalid');
    const decodedToken: any = jwt.verify(
      token,
      this.configService.get<string>('ACCESS_SECRET'),
    );
    // Decode token
    return decodedToken.rol;
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
