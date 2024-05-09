import { hash } from 'bcrypt';
import { IUser } from '../interfaces/user';
import { User } from '../models/user';
import { HttpException } from '../exceptions/httpException';

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
}

export default AuthService;
