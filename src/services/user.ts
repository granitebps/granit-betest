import { IUser } from '../interfaces/user';
import { User } from '../models/user';

class UserService {
  public getUsers = async (): Promise<IUser[]> => {
    const users: IUser[] = await User.find().select('-password');
    return users;
  };
}

export default UserService;
