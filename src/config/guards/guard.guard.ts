import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
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
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const auth = request.headers['authorization'];
    const token = auth && auth.split(' ')[1];
    if (typeof token === 'undefined')
      throw new ForbiddenException('token undefined');
    request.user = await this.jwtService.decodeToken(token);
    if (!roles) return true;
    //console.log('paso');
    const rol = await this.jwtService.typeRole(request.user);
    //console.log(Object(rol));
    let role = false;
    for (const pro in roles) {
      if (roles[pro] == rol) role = true;
    }
    if (!role) throw new BadRequestException('role not allowed');
    return true;
  }
}
