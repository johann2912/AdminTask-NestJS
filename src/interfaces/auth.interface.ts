import { Document } from 'mongoose';

export interface Auth extends Document {
  email: string;
  password: string;
}
