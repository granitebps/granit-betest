import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import { env, loadEnv } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/error';
import { connectDb } from './config/database';
import userRoutes from './routes/user';
import authRoutes from './routes/auth';
import { connectRedis } from './config/redis';
import { logger } from './utils/logger';

loadEnv();

const main = async () => {
  await connectDb();
  await connectRedis();

  const app = express();

  // Middleware
  app.use(morgan('dev'));
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.get('/', (req, res) => {
    res.json({ success: true, message: 'Node API' });
  });

  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/auth', authRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(env.APP_PORT, () => {
    logger(`Server is running on port ${env.APP_PORT}`);
  });
};

main().catch((err) => {
  logger(`Error starting server: ${err.message}`);
  console.error(err);
  process.exit(1);
});
