import { IsNotEmpty, IsString } from 'class-validator';

export class TaskCreateDTO {
  @IsString()
  @IsNotEmpty()
  readonly usuario: string;
  readonly compromiso: string;
  readonly fechaLimite: Date;
  readonly fechaCumplimiento: Date;
  readonly estado: number;
}
