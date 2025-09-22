import { sql } from "../utils/db.js";
import TryCatch from "../utils/TryCatch.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const getAllBlogs = TryCatch(async (req, res) => {
  const { category = "", searchQuery = "" } = req.query;

  let blogs = await sql`
    SELECT * FROM blogs
    WHERE
    (
      ${category} = '' OR (
        category ILIKE '%' || ${category} || '%'
      )
    )
    AND (
      ${searchQuery} = '' OR (
        title ILIKE '%' || ${searchQuery} || '%'
        OR description ILIKE '%' || ${searchQuery} || '%'
        OR category ILIKE '%' || ${searchQuery} || '%'
      )
    )
    ORDER BY create_at DESC
   `;

  return res.status(200).json(blogs);
});

export const getSingleBlog = TryCatch(async (req, res) => {
  const blog = await sql`SELECT * FROM blogs WHERE id = ${req.params.id}`;

  const { data } = await axios.get(
    `${process.env.USER_SERVICE}/api/v1/user/${blog[0]?.author}`,
    {
      headers: {
        authorization: req.headers.authorization,
      },
    }
  );

  return res.status(200).json({
    blog: blog[0],
    author: data,
  });
});
