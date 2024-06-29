const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());

// Connect to SQLite database
const db = new sqlite3.Database('./dictionary.db', (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Routes
app.get('/api/logograms', (req, res) => {
    const sql = 'SELECT * FROM logograms';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/logogram/:id', (req, res) => {
    const sql = 'SELECT * FROM logograms WHERE id = ?';
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(row);
    });
});

app.get('/api/definitions/:logogram_id', (req, res) => {
    const sql = 'SELECT * FROM definitions WHERE logogram_id = ?';
    const params = [req.params.logogram_id];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/example_sentences/:definition_id', (req, res) => {
    const sql = 'SELECT * FROM example_sentences WHERE definition_id = ?';
    const params = [req.params.definition_id];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
