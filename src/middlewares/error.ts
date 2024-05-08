import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/httpException';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new HttpException(404, `Not Found - ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
  res.status(err.code || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
