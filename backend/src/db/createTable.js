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

const createPostTable = `
  CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content VARCHAR(100) NOT NULL,
    user_id INT REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp
  );
`;

const createCommentsTable = `
  CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    content VARCHAR(100) NOT NULL,
    user_id INT REFERENCES users(id),
    post_id INT REFERENCES posts(id),
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp
  );
`;

const createVotesTable = `
  CREATE TABLE IF NOT EXISTS votes (
    user_id INT REFERENCES users(id),
    post_id INT REFERENCES posts(id),
    vote_type INT,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    PRIMARY KEY (user_id, post_id)
  );
`;

const createCommentsVotesTable = `
  CREATE TABLE IF NOT EXISTS commentsVotes (
    user_id INT REFERENCES users(id),
    comment_id INT REFERENCES comments(id),
    vote_type INT,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    PRIMARY KEY (user_id, comment_id)
  );
`;

const createFollows = `
  CREATE TABLE IF NOT EXISTS follows (
    follower_id INT REFERENCES users(id),
    following_id INT REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    PRIMARY KEY (follower_id, following_id)
  );
`;

async function createTable() {
  try {
    await pool.query(createFollows);
    console.log(' "users" table created successfully or already exists.');
  } catch (err) {
    console.error('Error creating the table:', err);
  } 
}

createTable();
