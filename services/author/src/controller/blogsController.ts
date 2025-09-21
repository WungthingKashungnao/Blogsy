import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import getBuffer from "../utils/dataUri.js";
import { sql } from "../utils/db.js";
import TryCatch from "../utils/TryCatch.js";
import cloudinary from "cloudinary";

export const createBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
  const { title, description, blogcontent, category } = req.body;

  const file = req.file;
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

  //   uploading the file to cloudinary in a folder called blogs
  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
    folder: "blogs",
  });

  const result = await sql`
    INSERT INTO blogs (title, description, image, blogcontent, category, author)
    VALUES (${title}, ${description}, ${cloud.secure_url}, ${blogcontent}, ${category}, ${req.user?._id})
    RETURNING *
  `;

  return res.status(200).json({
    message: "Blog Created Successfully",
    blogs: result[0],
  });
});
