import { IsNotEmpty, IsString } from 'class-validator';

export class UserCreateDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  readonly last_name: string;
  readonly document: string;
  readonly document_number: string;
  readonly email: string;
  readonly password: string;
  readonly rol: number;
}
