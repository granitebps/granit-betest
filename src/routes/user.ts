import express, { RequestHandler } from 'express';
import UserHandler from '../handlers/user';
import { verifyToken } from '../middlewares/auth';

const router = express.Router();

const userHandler = new UserHandler();

router.get('/', verifyToken as unknown as RequestHandler, userHandler.index);
router.get('/:id', verifyToken as unknown as RequestHandler, userHandler.show);

export default router;
