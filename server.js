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

//gebruiker op basis van id

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

app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send('Alle velden zijn verplicht');
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


//Lijst ophalen van nieuwsberichten

app.get('/newsposts', (req, res) => {
  const { title, author } = req.query;
  let query = 'SELECT * FROM newsposts';
  const params = [];

  if (title) {
    query += ' WHERE title LIKE ?';
    params.push(`%${title}%`);
  }

  if (author) {
    query += title ? ' AND author LIKE ?' : ' WHERE author LIKE ?';
    params.push(`%${author}%`);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Er is een fout opgetreden');
    } else {
      res.json(results);
    }
  });
});


//Haal een nieuwsbericht op basis van id

app.get('/newsposts/:id', (req, res) => {
  const postId = req.params.id;
  const query = 'SELECT * FROM newsposts WHERE id = ?';
  db.query(query, [postId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Er is een fout opgetreden');
    } else if (results.length === 0) {
      res.status(404).send('Nieuwbericht niet gevonden');
    } else {
      res.json(results[0]);
    }
  });
});

//Voeg een nieuwsbericht toe
app.post('/newsposts', (req, res) => {
  const { title, content, author } = req.body;

  if (!title || !content || !author) {
    return res.status(400).send('Alle velden zijn verplicht');
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

//Bestaand Nieuwsbericht bewerken
app.put('/newsposts/:id', (req, res) => {
  const postId = req.params.id;
  const { title, content, author } = req.body;

  if (!title || !content || !author) {
    return res.status(400).send('Alle velden zijn verplicht');
  }

  const query = 'UPDATE newsposts SET title = ?, content = ?, author = ? WHERE id = ?';
  db.query(query, [title, content, author, postId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Er is een fout opgetreden');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Nieuwbericht niet gevonden');
    } else {
      res.send('Nieuwbericht succesvol bijgewerkt');
    }
  });
});

//verwijder een bestaand nieuwsbericht
app.delete('/newsposts/:id', (req, res) => {
  const postId = req.params.id;
  const query = 'DELETE FROM newsposts WHERE id = ?';
  db.query(query, [postId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Er is een fout opgetreden');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Nieuwbericht niet gevonden');
    } else {
      res.send('Nieuwbericht succesvol verwijderd');
    }
  });
});



// Start server
app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});
