import { NextFunction, Request, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { ValidationException } from '../exceptions/validationException';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const data = errors.array().map((e) => {
      if (e.type === 'field') {
        return {
          message: e.msg,
          field: e.path,
        };
      }
      return {
        message: e.msg,
        field: e.msg,
      };
    });
    next(new ValidationException(422, data[0].message, data));
  };
};
