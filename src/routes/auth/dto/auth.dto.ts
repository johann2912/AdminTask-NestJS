import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthCreateDTO {
  @ApiProperty({ type: String, example: 'Matias@Manzano.com' })
  @IsString()
  @IsNotEmpty()
  email: string;
  @ApiProperty({ type: String, example: '12345' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
