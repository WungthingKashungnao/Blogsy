import express from "express";
import dotenv from "dotenv";
import { sql } from "./utils/db.js";
import blogRoutes from "./routes/blogRoutes.js";
import { v2 as cloudinary } from "cloudinary"; //cloudinary package to store images

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
app.use(express.json());
const port = process.env.PORT;

async function initDB() {
  try {
    // table to create blogs
    await sql`
        CREATE TABLE IF NOT EXISTS blogs(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            blogcontent TEXT NOT NULL,
            image VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // table to creat comments
    await sql`
        CREATE TABLE IF NOT EXISTS comments(
            id SERIAL PRIMARY KEY,
            comment VARCHAR(255) NOT NULL,
            userid VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL,
            blogid VARCHAR(255) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // table to creat saved blogs
    await sql`
        CREATE TABLE IF NOT EXISTS savedblogs(
            id SERIAL PRIMARY KEY,
            userid VARCHAR(255) NOT NULL,
            blogid VARCHAR(255) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    console.log("database initialized successfully");
  } catch (error: any) {
    console.log("Error initDB", error);
  }
}

app.use("/api/v1", blogRoutes);

initDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
