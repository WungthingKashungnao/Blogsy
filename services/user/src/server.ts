import express from "express";
import dotenv from "dotenv";
import connectDb from "./utils/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
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
