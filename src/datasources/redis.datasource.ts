import redis, { ClientOpts, RedisClient } from 'redis';
import logger from '../utilities/winston';

interface RedisConfig {
  hostname: string;
  port: number;
  options?: ClientOpts;
}

async function createRedisClient(config: RedisConfig): Promise<RedisClient> {
  try {
    const { port, hostname } = config;
    const redisClient = redis.createClient(port, hostname);
    return redisClient;
  } catch (e) {
    logger.info('[node-redis] redis error: ', e.message);
    throw e;
  }
}

export { createRedisClient };
