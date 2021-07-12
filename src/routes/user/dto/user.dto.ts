import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserCreateDTO {
  @ApiProperty({ type: String, example: 'Matias' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ type: String, example: 'Manzano' })
  @IsString()
  @IsNotEmpty()
  readonly last_name: string;

  @ApiProperty({ type: String, example: 'Cedula de Ciudadania' })
  @IsString()
  @IsNotEmpty()
  readonly document: string;

  @ApiProperty({ type: String, example: '753214689' })
  @IsString()
  @IsNotEmpty()
  readonly document_number: string;

  @ApiProperty({ type: String, example: 'Matias@Manzano.com' })
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ type: String, example: 'matiasmanzano' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsNumber()
  readonly rol: number;
}
