import { Schema, Types } from 'mongoose';
import { StatusTask } from 'src/enums/task.enum';

export const TaskSchema = new Schema(
  {
    usuario: {
      ref: 'user',
      type: Types.ObjectId,
      required: true,
    },
    compromiso: {
      type: String,
      required: true,
      min: 3,
    },
    fechaLimite: {
      type: Date,
      required: true,
    },
    fechaCumplimiento: {
      type: Date,
      required: false,
    },
    estado: {
      type: String,
      default: StatusTask.pendiente,
    },
  },
  { timestamps: true, versionKey: false },
);
