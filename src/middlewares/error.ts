import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/httpException';
import { ValidationException } from '../exceptions/validationException';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new HttpException(404, `Not Found - ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidationException) {
    res.status(err.code).json({
      success: false,
      message: err.message,
      fields: err.fields,
    });
  } else if (err instanceof HttpException) {
    res.status(err.code).json({
      success: false,
      message: err.message,
    });
  } else {
    logger(err.message);
    console.error(err);
    let message = err.message;
    if (env.NODE_ENV === 'production') {
      message = 'Internal Server Error';
    }
    res.status(500).json({
      success: false,
      message,
    });
  }
};
