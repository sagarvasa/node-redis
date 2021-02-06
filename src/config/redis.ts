const env: keyof typeof config = global.env as keyof typeof config;

interface RedisConfig {
  hostname: string;
  port: number;
  short_ttl?: number;
  medium_ttl?: number;
  very_long_ttl?: number;
  long_ttl?: number;
}

/* redis configuration based on environment
   replace with original values to get connected with redis server
*/
const local: RedisConfig = {
  hostname: 'localhost',
  port: 6379,
  short_ttl: 1800,
  medium_ttl: 3600,
  very_long_ttl: 28800,
  long_ttl: 14400,
};

const staging: RedisConfig = {
  hostname: 'staging-redis-all.usw2.cache.amazonaws.com',
  port: 6379,
  short_ttl: 1800,
  medium_ttl: 3600,
  very_long_ttl: 28800,
  long_ttl: 14400,
};

const dev: RedisConfig = {
  hostname: 'dev-redis-all.usw2.cache.amazonaws.com',
  port: 6379,
  short_ttl: 1800,
  medium_ttl: 3600,
  very_long_ttl: 28800,
  long_ttl: 14400,
};

const production: RedisConfig = {
  hostname: 'prod-redis-all.usw2.cache.amazonaws.com',
  port: 6379,
  short_ttl: 1800,
  medium_ttl: 3600,
  very_long_ttl: 28800,
  long_ttl: 14400,
};

const config = { local, staging, production, dev };

export default config[env];
