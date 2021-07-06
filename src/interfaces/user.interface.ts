import { Document } from 'mongoose';

export interface User extends Document {
  name: string;
  last_name: string;
  document: string;
  document_number: string;
  email: string;
  password: string;
  rol: number;
}
