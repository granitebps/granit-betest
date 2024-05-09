import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

import { IUser } from '../interfaces/user';
import { User } from '../models/user';
import { HttpException } from '../exceptions/httpException';
import { IAuthPayload, ILoginRequest, ILoginResponse } from '../interfaces/auth';
import { env } from '../config/env';

class AuthService {
  public register = async (data: IUser): Promise<IUser> => {
    const findUser = await User.findOne({ $or: [{ emailAddress: data.emailAddress }, { userName: data.userName }] });
    if (findUser) throw new HttpException(400, `Email or username already exists`);

    const pass = await hash(data.password, 10);
    const userData = new User({
      ...data,
      password: pass,
    });
    const savedUser = await userData.save();
    return savedUser.toObject({
      versionKey: false,
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    });
  };

  public login = async (data: ILoginRequest): Promise<ILoginResponse> => {
    const user: IUser | null = await User.findOne({ emailAddress: data.emailAddress });
    if (!user) throw new HttpException(400, 'Invalid email or password');

    const isPasswordMatch = await compare(data.password, user.password);
    if (!isPasswordMatch) throw new HttpException(400, 'Invalid email or password');

    const authPayload = {
      _id: user._id,
      emailAddress: user.emailAddress,
      userName: user.userName,
      identityNumber: user.identityNumber,
      accountNumber: user.accountNumber,
    } as IAuthPayload;
    const token = jwt.sign(authPayload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

    return { token, user: authPayload };
  };
}

export default AuthService;
