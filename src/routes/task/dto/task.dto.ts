import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class TaskCreateDTO {
  @ApiProperty({ type: String, example: '60e70202aa7e220a409990c9' })
  @IsString()
  @IsNotEmpty()
  readonly usuario: string;

  @ApiProperty({
    type: String,
    example: 'Clasificar al personal por antiguedad',
  })
  @IsString()
  @IsNotEmpty()
  readonly compromiso: string;

  @ApiProperty({ type: String, example: '2021-05-05T14:00:46.771Z' })
  @IsDate()
  @IsNotEmpty()
  readonly fechaLimite: Date;

  @IsDate()
  readonly fechaCumplimiento: Date;

  @IsDate()
  readonly estado: number;
}
