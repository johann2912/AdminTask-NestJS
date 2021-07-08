import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Jwt } from '../jwt/jwt.service';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: Jwt,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const auth = request.headers['authorization'];
    const token = auth && auth.split(' ')[1];
    if (typeof token === 'undefined')
      throw new BadRequestException('token undefined');
    request.user = await this.jwtService.decodeToken(token);
    return true;
  }

  /*
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.header['authorization'].split(' ')[1];
    if (!token) throw new BadRequestException('tokenhghgg');
    const respuesta = jwt.compare(request);
    //console.log(respuesta);
    Jwt.verify(token, this.configService.get<string>('ACCESS_SECRET'));
    return true;
  }
  */
}
