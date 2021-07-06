import { Schema } from 'mongoose';
// import * as bcrypt from 'bcrypt';

export const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
    },
    last_name: {
      type: String,
      required: true,
      min: 3,
    },
    document: {
      type: String,
      required: true,
    },
    document_number: {
      type: String,
      required: true,
      min: 3,
    },
    email: {
      type: String,
      required: true,
      min: 3,
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
      select: false,
    },
    rol: {
      type: Number,
      enum: [0, 1, 2],
      require: false,
    },
  },
  { timestamps: true, versionKey: false },
);

/*
// compare password
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
*/
