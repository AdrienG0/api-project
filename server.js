import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
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

app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Er is een fout opgetreden');
    } else {
      res.json(results);
    }
  });
});

app.post('/users', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send('Alle velden zijn verplicht');
  }

  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, password], (err, result) => {
    if (err) {
      console.error('Database fout:', err);
      res.status(500).send('Er is een fout opgetreden');
    } else {
      res.status(201).send('Gebruiker succesvol toegevoegd');
    }
  });
});


app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Er is een fout opgetreden');
    } else if (results.length === 0) {
      res.status(404).send('Gebruiker niet gevonden');
    } else {
      res.json(results[0]);
    }
  });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});
