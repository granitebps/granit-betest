import express, { RequestHandler } from 'express';
import UserHandler from '../handlers/user';
import { verifyToken } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { updateUserValidation } from '../validations/user';

const router = express.Router();

const userHandler = new UserHandler();

router.get('/', verifyToken as unknown as RequestHandler, userHandler.index);
router.get('/:id', verifyToken as unknown as RequestHandler, userHandler.show);
router.put('/:id', verifyToken as unknown as RequestHandler, validate(updateUserValidation), userHandler.update);

export default router;
