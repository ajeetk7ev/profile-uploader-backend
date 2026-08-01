import { query } from '../config/db.js';

// In-memory fallback store for local testing when PostgreSQL database is not connected
let memoryUsers = [
  {
    id: 1,
    first_name: 'Alex',
    last_name: 'Morgan',
    email: 'alex.morgan@example.com',
    age: 28,
    profile_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    first_name: 'David',
    last_name: 'Chen',
    email: 'david.chen@example.com',
    age: 34,
    profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];
let nextMemoryId = 3;

/**
 * Get all users ordered by creation date descending
 */
export const getAllUsers = async () => {
  try {
    const res = await query(
      'SELECT id, first_name, last_name, email, age, profile_image_url, created_at, updated_at FROM users ORDER BY created_at DESC;'
    );
    return res.rows;
  } catch (error) {
    console.warn('Postgres query failed, falling back to memory store:', error.message);
    return [...memoryUsers].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
};

/**
 * Get single user by ID
 */
export const getUserById = async (id) => {
  try {
    const res = await query(
      'SELECT id, first_name, last_name, email, age, profile_image_url, created_at, updated_at FROM users WHERE id = $1;',
      [id]
    );
    return res.rows[0] || null;
  } catch (error) {
    console.warn('Postgres query failed, falling back to memory store:', error.message);
    return memoryUsers.find((u) => u.id === parseInt(id, 10)) || null;
  }
};

/**
 * Check if email already exists
 */
export const getUserByEmail = async (email, excludeId = null) => {
  try {
    let sql = 'SELECT id, email FROM users WHERE LOWER(email) = LOWER($1)';
    const params = [email];

    if (excludeId) {
      sql += ' AND id != $2';
      params.push(excludeId);
    }

    const res = await query(sql, params);
    return res.rows[0] || null;
  } catch (error) {
    console.warn('Postgres query failed, falling back to memory store:', error.message);
    return memoryUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== parseInt(excludeId, 10)
    ) || null;
  }
};

/**
 * Create a new user profile
 */
export const createUser = async ({ first_name, last_name, email, age, profile_image_url }) => {
  try {
    const res = await query(
      `INSERT INTO users (first_name, last_name, email, age, profile_image_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, first_name, last_name, email, age, profile_image_url, created_at, updated_at;`,
      [first_name, last_name, email, age, profile_image_url || null]
    );
    return res.rows[0];
  } catch (error) {
    console.warn('Postgres query failed, falling back to memory store:', error.message);
    const newUser = {
      id: nextMemoryId++,
      first_name,
      last_name,
      email,
      age: parseInt(age, 10),
      profile_image_url: profile_image_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryUsers.push(newUser);
    return newUser;
  }
};

/**
 * Update an existing user profile
 */
export const updateUser = async (id, { first_name, last_name, email, age, profile_image_url }) => {
  try {
    const res = await query(
      `UPDATE users
       SET first_name = $1,
           last_name = $2,
           email = $3,
           age = $4,
           profile_image_url = COALESCE($5, profile_image_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING id, first_name, last_name, email, age, profile_image_url, created_at, updated_at;`,
      [first_name, last_name, email, age, profile_image_url, id]
    );
    return res.rows[0] || null;
  } catch (error) {
    console.warn('Postgres query failed, falling back to memory store:', error.message);
    const index = memoryUsers.findIndex((u) => u.id === parseInt(id, 10));
    if (index === -1) return null;

    memoryUsers[index] = {
      ...memoryUsers[index],
      first_name,
      last_name,
      email,
      age: parseInt(age, 10),
      profile_image_url: profile_image_url !== undefined ? profile_image_url : memoryUsers[index].profile_image_url,
      updated_at: new Date().toISOString(),
    };
    return memoryUsers[index];
  }
};

/**
 * Delete user profile
 */
export const deleteUser = async (id) => {
  try {
    const res = await query('DELETE FROM users WHERE id = $1 RETURNING id, profile_image_url;', [id]);
    return res.rows[0] || null;
  } catch (error) {
    console.warn('Postgres query failed, falling back to memory store:', error.message);
    const index = memoryUsers.findIndex((u) => u.id === parseInt(id, 10));
    if (index === -1) return null;
    const deleted = memoryUsers[index];
    memoryUsers.splice(index, 1);
    return deleted;
  }
};
