import express from "express";
import dotenv from "dotenv";
import blogRoutes from "./routes/blogRoutes.js";
import { createClient } from "redis";
import { startCacheConsumer } from "./utils/consumer.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;

startCacheConsumer(); //rabbitmq function to invalidate cache
// creating redis client
// It is good to set up redis before the api routes, so that redis is ready before the api are being used and so that it doesnt cause an error
export const redisClient = createClient({
  url: process.env.REDIS_URL!, // '!' tells TS that it is definitely not undefined
});
redisClient
  .connect()
  .then(() => console.log("Connected To Redis"))
  .catch(console.error);

app.use("/api/v1", blogRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
