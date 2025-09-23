import amqp from "amqplib";
import { redisClient } from "../server.js";
import { sql } from "./db.js";

interface CacheValidationMessage {
  action: string;
  keys: string[];
}

export const startCacheConsumer = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: "localhost",
      port: 5672,
      username: "admin",
      password: "admin123",
    });
    const channel = await connection.createChannel();
    const queueName = "cache-invalidation";
    // Declaring a Queue
    await channel.assertQueue(queueName, { durable: true }); // durable: true makes the queue persistent
    console.log("✅ Blog Service Cache Consumer Started");

    channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(
            msg.content.toString()
          ) as CacheValidationMessage;
          console.log(
            "📩 Blog Service Recieved Cache Invalidation Message",
            content
          );

          if (content.action === "invalidateCache") {
            for (const pattern of content.keys) {
              const keys = await redisClient.keys(pattern);

              if (keys.length > 0) {
                await redisClient.del(keys); //deleting the cache from redis
                console.log(
                  `🗑️ Blog Service invalidated ${keys.length} cache keys matching: ${pattern}`
                );

                const category = "";
                const searchQuery = "";
                const cacheKey = `blogs:${searchQuery}:${category}`;

                const blogs = await sql`
                    SELECT * FROM blogs ORDER BY create_at DESC
                `;

                // repopulating redis with the new data
                await redisClient.set(cacheKey, JSON.stringify(blogs), {
                  EX: 3600,
                });

                console.log("🔃 cache rebuilt with keys: ", cacheKey);
              }
            }
          }
          channel.ack(msg); //this is run multiple times until it succeeeds
        } catch (error) {
          console.error(
            `❌ Error processing cache invalidation in blog service`,
            error
          );

          //   this will reject our message and put in back to queue
          channel.nack(msg, false, true); //false as it failed, true to retry again
        }
      }
    });
  } catch (error) {
    console.error(`❌ Failed to start rabbitmq consumer`, error);
  }
};
