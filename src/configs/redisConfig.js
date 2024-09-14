// ** Lib
import { createClient } from 'redis';

// ** Constants
import { REDIS_URL } from "../constants/index.js";

export const client = createClient({
    url: REDIS_URL
});

export const redisConnection = async () => {

    client.on('error', (err) => {
        console.error('Redis client error:', err);
    });

    await client.connect();
};

