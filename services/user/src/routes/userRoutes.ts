import express from "express";
import {
  getUserProfile,
  loginUser,
  myProfile,
  updateUser,
} from "../controllers/userControllers.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express();

router.post("/login", loginUser);
router.get("/me", isAuth, myProfile);
router.get("/user/:id", isAuth, getUserProfile);
router.put("/user/update", isAuth, updateUser);

export default router;
