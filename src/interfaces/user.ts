import { Document } from 'mongoose';

export interface IUser extends Document {
  userName: string;
  accountNumber: string;
  emailAddress: string;
  identityNumber: string;
  password: string;
}
