import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/auth';
import { IUser } from '../interfaces/user';
import { ILoginRequest } from '../interfaces/auth';

class AuthHandler {
  public authService = new AuthService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userReq: IUser = req.body;
      const register = await this.authService.register(userReq);

      // Invalidate cache

      res.status(201).json({ success: true, message: 'User registered successfully', data: register });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginReq: ILoginRequest = req.body;
      const login = await this.authService.login(loginReq);
      res.json({ success: true, message: 'User logged in successfully', data: login });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthHandler;
