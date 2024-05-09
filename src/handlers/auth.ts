import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/auth';
import { IUser } from '../interfaces/user';

class AuthHandler {
  public authService = new AuthService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userReq: IUser = req.body;
      const register = await this.authService.register(userReq);

      // Invalidate cache

      res.json({ success: true, message: 'User registered successfully', data: register });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthHandler;
