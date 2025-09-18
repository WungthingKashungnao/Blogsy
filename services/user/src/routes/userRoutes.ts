import express from "express";
import { loginUser } from "../controllers/userControllers.js";

const router = express();

router.post("/login", loginUser);

export default router;
