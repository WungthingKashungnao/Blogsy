import express from "express";
import dotenv from "dotenv";
import { sql } from "./utils/db.js";
import blogRoutes from "./routes/blogRoutes.js";
import { v2 as cloudinary } from "cloudinary"; //cloudinary package to store images
import { connectRabbitMQ } from "./utils/rabbimq.js";
import initDB from "./utils/initDB.js";

dotenv.config();

const cloudName = process.env.Cloud_Name;
const cloudApiKey = process.env.Cloud_Api_Key;
const cloudApiSecret = process.env.Cloud_Api_Secret;
if (!cloudName || !cloudApiKey || !cloudApiSecret) {
  throw new Error("Missing Cloudinary environment variables");
}
// cloudinary configuration to store images
cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudApiKey,
  api_secret: cloudApiSecret,
});

const app = express();
connectRabbitMQ(); //calling function from utils to connect to rabbitmq
app.use(express.json());
const port = process.env.PORT;

await initDB(); //calling function to initialize db

app.use("/api/v1", blogRoutes);

initDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
