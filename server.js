import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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

// Helperfuncties
function isNumeric(value) {
  return /^\d+$/.test(value);
}

function isValidName(name) {
  return /^[a-zA-Z\s]+$/.test(name);
}

// Routes
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welkom</title>
    </head>
    <body>
      <h1>Welkom bij je API!</h1>
      <p><a href="/tester.html">Ga naar de API Tester</a></p>
      <p><a href="/docs.html">Bekijk de API Documentatie</a></p>
    </body>
    </html>
  `);
});

// CRUD-operaties voor Users
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

  if (!isValidName(name)) {
    return res.status(400).send('Naam mag geen cijfers bevatten');
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

  if (!isNumeric(userId)) {
    return res.status(400).send('ID moet een nummer zijn');
  }

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

app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  if (!isNumeric(userId)) {
    return res.status(400).send('ID moet een nummer zijn');
  }

  if (!name || !email || !password) {
    return res.status(400).send('Alle velden zijn verplicht');
  }

  if (!isValidName(name)) {
    return res.status(400).send('Naam mag geen cijfers bevatten');
  }

  const query = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
  db.query(query, [name, email, password, userId], (err, result) => {
    if (err) {
      console.error('Database fout:', err);
      res.status(500).send('Er is een fout opgetreden');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Gebruiker niet gevonden');
    } else {
      res.send('Gebruiker succesvol bijgewerkt');
    }
  });
});

app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;

  if (!isNumeric(userId)) {
    return res.status(400).send('ID moet een nummer zijn');
  }

  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Database fout:', err);
      res.status(500).send('Er is een fout opgetreden');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Gebruiker niet gevonden');
    } else {
      res.send('Gebruiker succesvol verwijderd');
    }
  });
});

// CRUD-operaties voor Newsposts
app.post('/newsposts', (req, res) => {
  const { title, content, author } = req.body;

  if (!title || !content || !author) {
    return res.status(400).send('Alle velden zijn verplicht');
  }

  if (!isValidName(author)) {
    return res.status(400).send('Auteur mag geen cijfers bevatten');
  }

  const query = 'INSERT INTO newsposts (title, content, author) VALUES (?, ?, ?)';
  db.query(query, [title, content, author], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Er is een fout opgetreden');
    } else {
      res.status(201).send('Nieuwbericht succesvol toegevoegd');
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});
