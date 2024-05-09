import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user';

class UserHandler {
  public userService = new UserService();

  public index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getUsers();
      res.json({ success: true, data: users, message: 'Users fetched successfully' });
    } catch (error) {
      next(error);
    }
  };
}

export default UserHandler;
