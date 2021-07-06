import { IsNotEmpty, IsString } from 'class-validator';

export class UserCreateDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
  last_name: string;
  document: string;
  document_number: string;
  email: string;
  password: string;
  role: number;
}
