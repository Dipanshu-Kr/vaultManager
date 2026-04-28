import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "PASSWORD",
  database: "password_vault",
});

// Helper to initialize tables
export async function initDB() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS passwords (
        id INT AUTO_INCREMENT PRIMARY KEY,
        website VARCHAR(255),
        username VARCHAR(255),
        password TEXT,
        url VARCHAR(255),
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("Database tables initialized");
  } catch (err) {
    console.error("Database initialization error:", err);
  }
}

// Initialize on first import
initDB();

export default db;
