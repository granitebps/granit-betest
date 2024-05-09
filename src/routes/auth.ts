import express from 'express';
import AuthHandler from '../handlers/auth';
import { validate } from '../middlewares/validation';
import { registerValidation } from '../validations/auth';

const router = express.Router();

const authHandler = new AuthHandler();

router.post('/register', validate(registerValidation), authHandler.register);

export default router;
