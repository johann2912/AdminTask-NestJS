import { Schema } from 'mongoose';
import { bcrypt } from 'bcrypt';

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
    },
    rol: {
      type: Number,
      enum: [0, 1, 2],
      require: false,
    },
  },
  { timestamps: true, versionKey: false },
);

// encrypt password
UserSchema.pre('save', function (next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(this.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      this.password = hash;
      next();
    });
  });
});

/*
// compare password
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
*/
