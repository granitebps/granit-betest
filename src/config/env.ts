import { EnvType, load } from 'ts-dotenv';

export type Env = EnvType<typeof schema>;

export const schema = {
  APP_PORT: Number,
  NODE_ENV: ['production' as const, 'development' as const],
  MONGODB_URI: String,
};

export let env: Env;

export function loadEnv(): void {
  env = load(schema);
}
