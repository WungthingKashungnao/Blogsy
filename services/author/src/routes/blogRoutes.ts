import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import uploadFile from "../middleware/multer.js";
import {
  createBlog,
  deleteBlog,
  updateBlog,
} from "../controller/blogsController.js";

const router = express();

router.post("/blog/new", isAuth, uploadFile, createBlog);
router.put("/blog/:id", isAuth, uploadFile, updateBlog);
router.delete("/blog/:id", isAuth, deleteBlog);

export default router;
