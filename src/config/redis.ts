import { createClient } from 'redis';
import redisMock from 'redis-mock';
import { env, loadEnv } from './env';
import { logger } from '../utils/logger';

loadEnv();

const initRedis = () => {
  if (env.NODE_ENV === 'test') {
    return redisMock.createClient();
  }
  return createClient({
    url: `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`,
    password: env.REDIS_PASSWORD,
  });
};

export const redisClient = initRedis();

export const connectRedis = async () => {
  redisClient.on('connect', function () {
    logger('Redis connected...');
  });
  redisClient.on('error', (err) => {
    logger(`Error connection to Redis: ${err.message}`);
    console.error(err);
  });
  await redisClient.connect();
  await redisClient.ping();
};

export const REDIS_USERS_KEY = ' redis_granit_betest';
