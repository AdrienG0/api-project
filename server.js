const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database verbinding
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database-verbinding mislukt:', err);
  } else {
    console.log('Verbonden met de database');
  }
});

// Routes
app.get('/', (req, res) => {
  res.send('Welkom bij je API!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});
