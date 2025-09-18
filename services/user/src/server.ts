import express from "express";
import dotenv from "dotenv";
import connectDb from "./utils/db.js";
dotenv.config();

const app = express();
connectDb();
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.status(200).send("helo world ok!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
