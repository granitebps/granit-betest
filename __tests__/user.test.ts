import { redisClient } from '../src/config/redis';
import { HttpException } from '../src/exceptions/httpException';
import { IUser } from '../src/interfaces/user';
import { User } from '../src/models/user';
import UserService from '../src/services/user';

describe('UserService Test', () => {
  it('should get all users', async () => {
    const userService = new UserService();

    User.find = jest.fn().mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValue([
        {
          userName: 'userName',
          accountNumber: 'accountNumber',
          emailAddress: 'emailAddress',
          identityNumber: 'identityNumber',
        },
      ]),
    }));

    const result = await userService.getUsers({});

    expect(result).toEqual([
      {
        userName: 'userName',
        accountNumber: 'accountNumber',
        emailAddress: 'emailAddress',
        identityNumber: 'identityNumber',
      },
    ]);
  });

  it('should get user by id', async () => {
    const userService = new UserService();

    User.findById = jest.fn().mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValue({
        userName: 'userName',
        accountNumber: 'accountNumber',
        emailAddress: 'emailAddress',
        identityNumber: 'identityNumber',
      }),
    }));

    const result = await userService.getUser('id');

    expect(result).toEqual({
      userName: 'userName',
      accountNumber: 'accountNumber',
      emailAddress: 'emailAddress',
      identityNumber: 'identityNumber',
    });
  });

  it('should handle update user failed: user already exists', async () => {
    const userService = new UserService();

    User.findOne = jest.fn().mockResolvedValue({
      userName: 'userName',
      emailAddress: 'emailAddress',
    });

    const payload = {
      userName: 'userName',
      accountNumber: 'accountNumber',
      emailAddress: 'emailAddress',
      identityNumber: 'identityNumber',
      password: 'password',
    } as IUser;

    await expect(userService.updateUser('id', payload)).rejects.toThrow(HttpException);
  });

  it('should handle update user failed: user not found', async () => {
    const userService = new UserService();

    User.findOne = jest.fn().mockResolvedValue(null);
    User.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    const payload = {
      userName: 'userName',
      accountNumber: 'accountNumber',
      emailAddress: 'emailAddress',
      identityNumber: 'identityNumber',
      password: 'password',
    } as IUser;

    await expect(userService.updateUser('id', payload)).rejects.toThrow(HttpException);
  });

  it('should update user', async () => {
    const userService = new UserService();

    User.findOne = jest.fn().mockResolvedValue(null);
    User.findByIdAndUpdate = jest.fn().mockResolvedValue({
      toObject: jest.fn().mockReturnValue({
        userName: 'userName',
        accountNumber: 'accountNumber',
        emailAddress: 'emailAddress',
        identityNumber: 'identityNumber',
      }),
    });

    redisClient.del = jest.fn().mockResolvedValue({});

    const result = await userService.updateUser('id', {
      userName: 'userName',
      accountNumber: 'accountNumber',
      emailAddress: 'emailAddress',
      identityNumber: 'identityNumber',
      password: 'password',
    } as IUser);

    expect(result).toEqual({
      userName: 'userName',
      accountNumber: 'accountNumber',
      emailAddress: 'emailAddress',
      identityNumber: 'identityNumber',
    });
  });

  it('should handle delete user failed', async () => {
    const userService = new UserService();

    User.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    await expect(userService.deleteUser('id')).rejects.toThrow(HttpException);
  });

  it('should handle delete user success', async () => {
    const userService = new UserService();

    User.findByIdAndDelete = jest.fn().mockResolvedValue(true);

    const result = await userService.deleteUser('id');
    expect(result).toBeUndefined();
  });
});
