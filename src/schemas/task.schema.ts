import { Schema, Types } from 'mongoose';
import { Etask } from 'src/enums/task.enum';

export const TaskSchema = new Schema(
  {
    usuario: {
      ref: 'User',
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
      type: Number,
      default: Etask.pendiente,
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);
