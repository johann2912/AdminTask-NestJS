import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Jwt } from '../jwt/jwt.service';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: Jwt,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.header['authorization'].split(' ')[1];
    //this.jwtService(token);
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
