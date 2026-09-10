const Redis = require("ioredis");

// Connect to Redis if URL provided, otherwise use in-memory Map
let redis = null;
const mem = new Map(); // fallback for local dev

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, { lazyConnect: true });
  redis.on("connect", () => console.log("Redis connected".green));
  redis.on("error", (err) => console.error("Redis error:", err.message));
  redis.connect().catch(() => {});
} else {
  console.warn("REDIS_URL not set — using in-memory presence (single instance only)".yellow);
}

const TTL = 3600; // seconds

// key helpers
const pKey = (userId) => `presence:${userId}`;
const sKey = (socketId) => `socket:${socketId}`;

const presenceStore = {
  // Called when a user connects
  async setOnline(userId, socketId) {
    if (redis) {
      await redis.set(pKey(userId), socketId, "EX", TTL);
      await redis.set(sKey(socketId), userId, "EX", TTL);
    } else {
      mem.set(pKey(userId), socketId);
      mem.set(sKey(socketId), userId);
    }
  },

  // Called on disconnect to find which user owned this socket
  async getUserIdBySocket(socketId) {
    if (redis) return redis.get(sKey(socketId));
    return mem.get(sKey(socketId)) || null;
  },

  // Called when a user disconnects
  async setOffline(userId, socketId) {
    if (redis) {
      await redis.del(pKey(userId));
      await redis.del(sKey(socketId));
    } else {
      mem.delete(pKey(userId));
      mem.delete(sKey(socketId));
    }
  },

  // Returns array of all currently online userIds
  async getAllOnlineIds() {
    if (redis) {
      const keys = await redis.keys("presence:*");
      return keys.map((k) => k.replace("presence:", ""));
    }
    return [...mem.keys()]
      .filter((k) => k.startsWith("presence:"))
      .map((k) => k.replace("presence:", ""));
  },
};

module.exports = presenceStore;
