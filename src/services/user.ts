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
}

export default UserService;
