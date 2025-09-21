import express from "express";
import { getAllBlogs } from "../controllers/blogController.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.get("/blog/all", getAllBlogs);

export default router;
