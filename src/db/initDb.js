import { pool } from '../config/db.js';

const createTableQuery = `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INT NOT NULL CHECK (age > 0 AND age < 150),
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

export const initDb = async () => {
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    client.release();
    console.log('✅ PostgreSQL database tables initialized successfully.');
    return true;
  } catch (error) {
    console.warn('⚠️ Warning: Could not connect to PostgreSQL database or initialize table:', error.message);
    console.warn('ℹ️ Running backend server in hybrid mode. Configure your PostgreSQL / RDS credentials in .env to persist to database.');
    return false;
  }
};
