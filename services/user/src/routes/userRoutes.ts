import express from "express";
import {
  getUserProfile,
  loginUser,
  myProfile,
  updateProfilePic,
  updateUser,
} from "../controllers/userControllers.js";
import { isAuth } from "../middleware/isAuth.js";
import uploadFile from "../middleware/multer.js";

const router = express();

router.post("/login", loginUser);
router.get("/me", isAuth, myProfile);
router.get("/user/:id", isAuth, getUserProfile);
router.put("/user/update", isAuth, updateUser);
router.put("/user/update/pic", isAuth, uploadFile, updateProfilePic);

export default router;
