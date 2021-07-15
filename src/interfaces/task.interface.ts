import { Document } from 'mongoose';

export interface Task extends Document {
  usuario: string;
  compromiso: string;
  fechaLimite: Date;
  fechaCumplimiento: Date;
  estado: number;
  isCompleted: boolean;
}
