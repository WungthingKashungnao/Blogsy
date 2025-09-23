import amqp from "amqplib";

let channel: amqp.Channel;
// function to connect to rabbitmq using amplib
export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: "localhost",
      port: 5672,
      username: "admin",
      password: "admin123",
    });

    channel = await connection.createChannel();
    console.log("✅ Connected To Rabbitmq");
  } catch (error) {
    console.error("❌ Failed To Connect To Rabbitmq", error);
  }
};

// function to publish message to queue
export const publishToQueue = async (queueName: string, message: any) => {
  if (!channel) {
    console.log("Rabbitmq channel is not initialized");
    return;
  }

  // Declaring a Queue
  await channel.assertQueue(queueName, { durable: true }); // durable: true makes the queue persistent

  // sendin message to queue
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
};

// function to invalidate cache
export const invalidateCacheJob = async (cacheKeys: string[]) => {
  try {
    const message = {
      action: "invalidateCache",
      keys: cacheKeys,
    };

    await publishToQueue("cache-invalidation", message);
    console.log("✅ Cache Invalidation job published to Rabbitmq");
  } catch (error) {
    console.error("❌ Failed To Publish Cache on Rabbitmq", error);
  }
};
