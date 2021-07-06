import { IsNotEmpty, IsString } from 'class-validator';

export class AuthCreateDTO {
  @IsString()
  @IsNotEmpty()
  email: string;
  password: string;
}
