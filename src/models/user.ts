import { Document, Schema, model } from 'mongoose';
import { IUser } from '../interfaces/user';

const userSchema = new Schema({
  userName: {
    type: String,
    requied: true,
    index: {
      unique: true,
    },
  },
  accountNumber: {
    type: String,
    required: true,
    index: true,
  },
  emailAddress: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  identityNumber: {
    type: String,
    required: true,
    minLength: 16,
    maxLength: 16,
    index: {
      unique: true,
    },
  },
  password: {
    type: String,
    required: true,
  },
});

export const User = model<IUser & Document>('User', userSchema);
