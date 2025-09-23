import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import getBuffer from "../utils/dataUri.js";
import { sql } from "../utils/db.js";
import { invalidateCacheJob } from "../utils/rabbimq.js";
import TryCatch from "../utils/TryCatch.js";
import cloudinary from "cloudinary";

export const createBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
  const { title, description, blogcontent, category } = req.body;

  const file = req.file; //recieving file from user which is in binary data format because of multer
  if (!file) {
    return res.status(400).json({
      message: "No file to upload",
    });
  }

  const fileBuffer = getBuffer(file); //take the file in binary format transforming to data uri format

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

  await invalidateCacheJob(["blogs:*"]); //calling rabbitmq function to invalidate redis cache with the similar keys

  return res.status(200).json({
    message: "Blog Created Successfully",
    blogs: result[0],
  });
});

export const updateBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { title, description, blogcontent, category } = req.body;

  const file = req.file;

  const blog: any = await sql`SELECT * FROM blogs WHERE id = ${id}`;

  if (!blog.length) {
    return res.status(404).json({
      message: "No Blog with this ids",
    });
  }

  if (blog[0].author !== req.user?._id) {
    return res.status(401).json({
      message: "You are not the author of this blog",
    });
  }

  let imageUrl = blog[0].image;

  if (file) {
    const fileBuffer = getBuffer(file); //take the file in binary format transforming to data uri format

    if (!fileBuffer || !fileBuffer.content) {
      return res.status(400).json({
        message: "Failed to generate buffer",
      });
    }

    //   uploading the file to cloudinary in a folder called blogs
    const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
      folder: "blogs",
    });

    imageUrl = cloud.secure_url;
  }

  const updateBlog = await sql`
    UPDATE blogs SET
      title = ${title || blog[0].title},
      description = ${description || blog[0].description},
      image = ${imageUrl},
      blogcontent = ${blogcontent || blog[0].blogcontent},
      category = ${category || blog[0].category}
    WHERE id = ${id}
    RETURNING *
  `;

  return res.status(200).json({
    message: "Blog Updated",
    blog: updateBlog[0],
  });
});

export const deleteBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
  const blog: any = await sql`SELECT * FROM blogs WHERE id = ${req.params.id}`;

  if (blog[0].author !== req.user?._id) {
    return res.status(401).json({
      message: "You are not the author of this blog",
    });
  }

  await sql`DELETE FROM blogs WHERE id = ${req.params.id}`;
  await sql`DELETE FROM savedblogs WHERE blogid = ${req.params.id}`;
  await sql`DELETE FROM comments WHERE blogid = ${req.params.id}`;

  return res.status(200).json({
    messsage: "Blog Deleted Successfully",
  });
});
