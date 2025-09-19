import User from "../model/User.js";
import jwt from "jsonwebtoken";
import TryCatch from "../utils/TryCatch.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import getBuffer from "../utils/dataUri.js";
import { v2 as cloudinary } from "cloudinary";

export const loginUser = TryCatch(async (req, res) => {
  const { email, name, image } = req.body;
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      image,
    });
  }

  const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
    expiresIn: "5d",
  });

  return res.status(200).json({
    message: "Login Successfull",
    token,
    user,
  });
});

// controller to get my profile
export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;

  return res.status(200).json(user);
});

// controller to get other user profiles
export const getUserProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "No user found with id",
    });
  }

  return res.status(200).json(user);
});

// controller to update own profile
export const updateUser = TryCatch(async (req: AuthenticatedRequest, res) => {
  const { name, instagram, facebook, linkedin, bio } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user?._id, //this id is from the isAuth middleware, which holds the id of the currently logged in user
    {
      name,
      instagram,
      facebook,
      linkedin,
      bio,
    },
    { new: true }
  );

  const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
    expiresIn: "5d",
  });

  return res.status(200).json({
    message: "Successfully Updaetd User",
    token,
    user,
  });
});

// controller to update profile pic
export const updateProfilePic = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const file = req.file; //taking the file uploaded from multer - which is in buffer

    if (!file) {
      return res.status(400).json({
        message: "No file to upload",
      });
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
      return res.status(400).json({
        message: "Failed to generate buffer",
      });
    }

    // uploading file to cloudinary in a folder calld blogs
    const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
      folder: "blogs",
    });

    // uploading the file url from coludinary to mongodb
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        image: cloud.secure_url,
      },
      { new: true }
    );

    const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
      expiresIn: "5d",
    });

    return res.status(200).json({
      message: "Successfully Updaetd User Profile Picture",
      token,
      user,
    });
  }
);
