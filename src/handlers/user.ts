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

  public show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUser(req.params.id);
      res.json({ success: true, data: user, message: 'User fetched successfully' });
    } catch (error) {
      next(error);
    }
  };
}

export default UserHandler;
