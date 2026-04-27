import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Dipanshu@4512",
  database: "password_vault",
});

export default db;