import { hash } from 'bcrypt';
import { HttpException } from '../exceptions/httpException';
import { IUser } from '../interfaces/user';
import { User } from '../models/user';
import { REDIS_USERS_KEY, redisClient } from '../config/redis';

class UserService {
  public getUsers = async (): Promise<IUser[]> => {
    let users: IUser[];

    const redisUsers = await redisClient.get(REDIS_USERS_KEY);
    if (redisUsers) {
      users = JSON.parse(redisUsers);
    } else {
      users = await User.find().select('-password');
      await redisClient.set(REDIS_USERS_KEY, JSON.stringify(users));
    }

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

    await redisClient.del(REDIS_USERS_KEY);

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
    await redisClient.del(REDIS_USERS_KEY);
  };
}

export default UserService;
