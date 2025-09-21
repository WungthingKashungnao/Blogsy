import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import uploadFile from "../middleware/multer.js";
import { createBlog } from "../controller/blogsController.js";

const router = express();

router.post("/blog/new", isAuth, uploadFile, createBlog);

export default router;
