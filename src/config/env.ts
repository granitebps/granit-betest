import { EnvType, load } from 'ts-dotenv';

export type Env = EnvType<typeof schema>;

export const schema = {
  APP_PORT: Number,
  NODE_ENV: ['production' as const, 'development' as const, 'test' as const],
  MONGODB_URI: String,
  JWT_SECRET: String,
  JWT_EXPIRES_IN: Number, // in seconds
  REDIS_HOST: String,
  REDIS_PORT: Number,
  REDIS_PASSWORD: {
    type: String,
    optional: true,
  },
};

export let env: Env;

export function loadEnv(): void {
  env = load(schema);
}
