const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new Database('database.db');

// Create users table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
  )
`);

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
    const result = stmt.run(name, email);
    res.json({ id: result.lastInsertRowid, name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));