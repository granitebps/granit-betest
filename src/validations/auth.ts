import { body } from 'express-validator';

export const registerValidation = [
  body('userName').notEmpty().withMessage('Username is required'),
  body('accountNumber').notEmpty().withMessage('Account Number is required'),
  body('emailAddress').notEmpty().withMessage('Email is required').isEmail().withMessage('Not a valid email'),
  body('identityNumber')
    .notEmpty()
    .withMessage('Identity Number is required')
    .isLength({ min: 16, max: 16 })
    .withMessage('Identity Number must be 16 chars'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be min 8 chars'),
];

export const loginValidation = [
  body('emailAddress').notEmpty().withMessage('Email is required').isEmail().withMessage('Not a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];
