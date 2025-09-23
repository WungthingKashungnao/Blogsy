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
    console.log("❌ Failed To Connect To Rabbitmq");
  }
};
