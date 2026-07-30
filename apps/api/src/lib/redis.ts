import { Redis, RedisOptions } from 'ioredis';
import { env } from '../config/env';

const redisOptions: RedisOptions = {
  retryStrategy(times) {
    return Math.min(times * 100, 3000);
  },
  maxRetriesPerRequest: null,
};

export const redisClient = new Redis(env.REDIS_URL, redisOptions);

redisClient.on('connect', () => {
  console.log('Redis connected successfully');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing Redis connection');
  redisClient.quit();
});

process.on('SIGINT', () => {
  console.log('SIGINT received, closing Redis connection');
  redisClient.quit();
});

const PREFIX = 'tasma:';

function getPrefixedKey(key: string): string {
  return key.startsWith(PREFIX) ? key : `${PREFIX}${key}`;
}

/**
 * Helper to get and parse JSON from Redis
 * @param key The Redis key
 * @returns Parsed JSON object or null if not found
 */
export async function getJson<T>(key: string): Promise<T | null> {
  const data = await redisClient.get(getPrefixedKey(key));
  if (!data) return null;
  try {
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error parsing JSON for key ${key}:`, error);
    return null;
  }
}

/**
 * Helper to stringify and set JSON in Redis
 * @param key The Redis key
 * @param value The value to stringify and store
 * @param ttlSeconds Optional TTL in seconds
 */
export async function setJson(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
  const stringified = JSON.stringify(value);
  const prefixedKey = getPrefixedKey(key);
  
  if (ttlSeconds) {
    await redisClient.setex(prefixedKey, ttlSeconds, stringified);
  } else {
    await redisClient.set(prefixedKey, stringified);
  }
}

/**
 * Helper to delete a key
 * @param key The Redis key
 */
export async function del(key: string): Promise<number> {
  return redisClient.del(getPrefixedKey(key));
}

/**
 * Helper to check if a key exists
 * @param key The Redis key
 */
export async function exists(key: string): Promise<boolean> {
  const result = await redisClient.exists(getPrefixedKey(key));
  return result > 0;
}

/**
 * Helper to increment a key
 * @param key The Redis key
 */
export async function incr(key: string): Promise<number> {
  return redisClient.incr(getPrefixedKey(key));
}

/**
 * Helper to set expiry on a key
 * @param key The Redis key
 * @param seconds TTL in seconds
 */
export async function expire(key: string, seconds: number): Promise<number> {
  return redisClient.expire(getPrefixedKey(key), seconds);
}
