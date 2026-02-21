const pool = require('./db')


const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp
  );
`;

async function createTable() {
  try {
    await pool.query(createTableQuery);
    console.log(' "users" table created successfully or already exists.');
  } catch (err) {
    console.error('Error creating the table:', err);
  } 
}

createTable();
