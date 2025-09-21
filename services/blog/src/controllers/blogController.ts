import { sql } from "../utils/db.js";
import TryCatch from "../utils/TryCatch.js";

export const getAllBlogs = TryCatch(async (req, res) => {
  let blogs = await sql`SELECT * FROM blogs ORDER BY create_at DESC`;

  return res.status(200).json(blogs);
});
