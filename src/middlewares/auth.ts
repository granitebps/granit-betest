import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { HttpException } from '../exceptions/httpException';
import { env } from '../config/env';
import { IAuthPayload, IRequestWithAuth } from '../interfaces/auth';

export const verifyToken = async (req: IRequestWithAuth, res: Response, next: NextFunction) => {
  try {
    const authToken = req.headers['authorization'];
    const token = authToken && authToken.split(' ')[1];

    if (token) {
      const resp = jwt.verify(token, env.JWT_SECRET) as IAuthPayload;
      req.user = resp;

      next();
    } else {
      next(new HttpException(401, 'Unauthorized'));
    }
  } catch (error) {
    next(new HttpException(401, 'Unauthorized'));
  }
};
