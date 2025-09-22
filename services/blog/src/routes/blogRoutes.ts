import express from "express";
import { getAllBlogs, getSingleBlog } from "../controllers/blogController.js";

const router = express.Router();

router.get("/blog/all", getAllBlogs);
router.get("/blog/:id", getSingleBlog);

export default router;
