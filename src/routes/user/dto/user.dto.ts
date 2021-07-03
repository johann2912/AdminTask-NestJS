import { IsNotEmpty, IsString } from 'class-validator';

export class UserCreateDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}
