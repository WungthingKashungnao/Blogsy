import express from "express";
import dotenv from "dotenv";
import connectDb from "./utils/db.js";
import userRoutes from "./routes/userRoutes.js";
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
app.use(express.json()); //middleware so that express can take json value from req.body
connectDb(); //connection to databse function
const port = process.env.PORT;

app.use("/api/v1", userRoutes);

app.get("/", (req, res) => {
  res.status(200).send("helo world ok!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
