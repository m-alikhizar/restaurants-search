const Redis = require('ioredis');


// Get Redis host from environment variable, default to localhost
const redisHost = process.env.REDIS_HOST || 'localhost';

// Create a Redis client instance
const redis = new Redis({
    host: redisHost, // Redis server host
    port: 6379,        // Redis server port
    // Add other options as needed
});

// Handle connection events
redis.on('connect', () => {
    console.log('Connected to Redis: 6379');
});

redis.on('error', (err) => {
    console.error('Error connecting to Redis:', err);
});

module.exports = redis;
