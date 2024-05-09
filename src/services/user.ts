import { hash } from 'bcrypt';
import { HttpException } from '../exceptions/httpException';
import { IUser } from '../interfaces/user';
import { User } from '../models/user';

class UserService {
  public getUsers = async (): Promise<IUser[]> => {
    const users: IUser[] = await User.find().select('-password');
    return users;
  };

  public getUser = async (id: string): Promise<IUser> => {
    const user: IUser | null = await User.findById(id).select('-password');
    if (!user) {
      throw new HttpException(400, 'User not found');
    }
    return user;
  };

  public updateUser = async (id: string, userData: IUser): Promise<IUser> => {
    const existsUsernameOrEmail = await User.findOne({
      $or: [{ userName: userData.userName }, { emailAddress: userData.emailAddress }],
      _id: { $ne: id },
    });
    if (existsUsernameOrEmail) {
      throw new HttpException(400, 'Username or Email already exists');
    }

    if (userData.password) {
      userData.password = await hash(userData.password, 10);
    }

    const user: IUser | null = await User.findByIdAndUpdate(id, userData, { new: true, runValidators: true });
    if (!user) {
      throw new HttpException(400, 'User not found');
    }
    return user.toObject({
      versionKey: false,
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    });
  };

  public deleteUser = async (id: string): Promise<void> => {
    const user: IUser | null = await User.findByIdAndDelete(id);
    if (!user) {
      throw new HttpException(400, 'User not found');
    }
  };
}

export default UserService;
