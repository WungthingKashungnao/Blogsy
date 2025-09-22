import { sql } from "../utils/db.js";
import TryCatch from "../utils/TryCatch.js";

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
