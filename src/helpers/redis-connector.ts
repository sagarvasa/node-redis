import { RedisClient } from 'redis';
import { createRedisClient } from '../datasources';
import redisConfig from '../config/redis';
import logger from '../utilities/winston';

class RedisConnector {
  private redisClient!: RedisClient;

  constructor() {
    this.createClient(redisConfig)
      .then(() => {})
      .catch(() => {});
  }

  private async createClient(config: { hostname: string; port: number; options?: object }) {
    this.redisClient = await createRedisClient(config);

    this.redisClient.on('error', function (e) {
      logger.info('[node-redis] Redis connection error ' + e.message);
    });
  }

  public setValue(key: string, value: string, ttl?: number) {
    this.redisClient.set(key, value);
    if (ttl) {
      this.redisClient.expire(key, ttl);
    }
  }

  public getValue(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.redisClient.get(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  public deleteValue(key: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.redisClient.del(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  public incrementValue(key: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.redisClient.incr(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  public ttl(key: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.redisClient.ttl(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }
}

export default new RedisConnector();
