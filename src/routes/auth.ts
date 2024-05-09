import express from 'express';
import AuthHandler from '../handlers/auth';
import { validate } from '../middlewares/validation';
import { loginValidation, registerValidation } from '../validations/auth';

const router = express.Router();

const authHandler = new AuthHandler();

router.post('/register', validate(registerValidation), authHandler.register);
router.post('/login', validate(loginValidation), authHandler.login);

export default router;
