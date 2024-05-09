import { hash } from 'bcrypt';
import { redisClient } from '../src/config/redis';
import { HttpException } from '../src/exceptions/httpException';
import { IUser } from '../src/interfaces/user';
import { User } from '../src/models/user';
import AuthService from '../src/services/auth';

describe('Auth Service Test', () => {
  it('should handle failed register', async () => {
    const authService = new AuthService();

    const payload = {
      emailAddress: '',
      userName: '',
      accountNumber: '',
      identityNumber: '',
      password: '',
    } as IUser;

    User.findOne = jest.fn().mockReturnValue({
      emailAddress: 'emailAddress',
    });

    await expect(authService.register(payload)).rejects.toThrow(HttpException);
  });

  it('should handle successful register', async () => {
    const authService = new AuthService();

    const payload = {
      emailAddress: 'emailAddress',
      userName: 'userName',
      accountNumber: 'accountNumber',
      identityNumber: 'identityNumber',
      password: 'password',
    } as IUser;

    User.findOne = jest.fn().mockReturnValue(null);
    User.prototype.save = jest.fn().mockResolvedValue({
      toObject: jest.fn().mockReturnValue(payload),
    });

    redisClient.del = jest.fn().mockResolvedValue({});

    const result = await authService.register(payload);

    expect(result).toEqual(payload);
  });

  it('should handle failed login: user not found', async () => {
    const authService = new AuthService();
    const payload = {
      emailAddress: 'emailAddress',
      password: 'password',
    };

    User.findOne = jest.fn().mockReturnValue(null);

    await expect(authService.login(payload)).rejects.toThrow(HttpException);
  });

  it('should handle failed login: password do not match', async () => {
    const authService = new AuthService();
    const payload = {
      emailAddress: 'emailAddress',
      password: 'password123',
    };

    User.findOne = jest.fn().mockReturnValue({
      password: await hash('password', 10),
    });

    await expect(authService.login(payload)).rejects.toThrow(HttpException);
  });

  it('should handle success login', async () => {
    const authService = new AuthService();
    const payload = {
      _id: 'id',
      emailAddress: 'emailAddress',
      userName: 'userName',
      accountNumber: 'accountNumber',
      identityNumber: 'identityNumber',
      password: 'password',
    };

    User.findOne = jest.fn().mockReturnValue({
      _id: 'id',
      emailAddress: 'emailAddress',
      userName: 'userName',
      accountNumber: 'accountNumber',
      identityNumber: 'identityNumber',
      password: await hash('password', 10),
    });

    const result = await authService.login(payload);

    expect(result).toHaveProperty('token');
  });
});
