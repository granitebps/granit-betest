import { createClient } from 'redis';
import { env, loadEnv } from './env';

loadEnv();

export const redisClient = createClient({
  url: `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`,
  password: env.REDIS_PASSWORD,
});

export const connectRedis = async () => {
  redisClient.on('connect', function () {
    console.log('Redis connected...');
  });
  redisClient.on('error', (err) => {
    console.log('Error connection to Redis');
    console.error(err);
  });
  await redisClient.connect();
  await redisClient.ping();
};

export const REDIS_USERS_KEY = ' redis_granit_betest';
