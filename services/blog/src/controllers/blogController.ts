import { redisClient } from "../server.js";
import { sql } from "../utils/db.js";
import TryCatch from "../utils/TryCatch.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const getAllBlogs = TryCatch(async (req, res) => {
  const { category = "", searchQuery = "" } = req.query;

  // making redis cache key
  const cacheKey = `blogs:${searchQuery}:${category}`;
  const cached = await redisClient.get(cacheKey);

  if (cached) {
    // returning data from redis if there is an existing cache
    console.log("serving data from redis cache");
    return res.status(200).json(JSON.parse(cached));
  }

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

  console.log("serving data from db");
  await redisClient.set(cacheKey, JSON.stringify(blogs), { EX: 3600 }); // storing data in redis
  return res.status(200).json(blogs);
});

export const getSingleBlog = TryCatch(async (req, res) => {
  // making redis cache key
  const blogId = req.params.id;
  const cacheKey = `blogs:${blogId}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    // returning data from redis if there is an existing cache
    console.log("serving data from redis cache");
    return res.status(200).json(JSON.parse(cached));
  }
  const blog = await sql`SELECT * FROM blogs WHERE id = ${blogId}`;

  const { data } = await axios.get(
    `${process.env.USER_SERVICE}/api/v1/user/${blog[0]?.author}`,
    {
      headers: {
        authorization: req.headers.authorization,
      },
    }
  );

  if (blog.length === 0) {
    return res.status(400).json({
      message: `No Blog With This ID: ${blogId}`,
    });
  }

  console.log("serving data from db");
  const responseData = {
    blog: blog[0],
    author: data,
  };
  await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 3600 }); // storing data in redis
  return res.status(200).json(responseData);
});
