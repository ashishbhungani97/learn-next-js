// lib/db.js

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 10, // Adjust as needed
  uri: process.env.DATABASE_URL,
});

export default pool;
