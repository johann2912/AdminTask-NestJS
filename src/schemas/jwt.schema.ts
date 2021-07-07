import { Schema } from 'mongoose';

export const JwtSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    require: true,
  },
  refresh: {
    type: String,
    require: true,
  },
});
