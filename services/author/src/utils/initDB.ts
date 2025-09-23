import { sql } from "./db.js";

const initDB = async () => {
  try {
    // table to create blogs
    await sql`
        CREATE TABLE IF NOT EXISTS blogs(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            blogcontent TEXT NOT NULL,
            image VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // table to creat comments
    await sql`
        CREATE TABLE IF NOT EXISTS comments(
            id SERIAL PRIMARY KEY,
            comment VARCHAR(255) NOT NULL,
            userid VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL,
            blogid VARCHAR(255) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // table to creat saved blogs
    await sql`
        CREATE TABLE IF NOT EXISTS savedblogs(
            id SERIAL PRIMARY KEY,
            userid VARCHAR(255) NOT NULL,
            blogid VARCHAR(255) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    console.log("database initialized successfully");
  } catch (error: any) {
    console.log("Error initDB", error);
  }
};

export default initDB;
