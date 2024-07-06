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
app.get('/api/word/:wordId', (req, res) => {
    const sql = 'SELECT * FROM words WHERE word_id = ?';
    const params = [req.params.wordId];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(row);
    });
});

app.get('/api/definitions/:wordId', (req, res) => {
    const sql = `
        SELECT
            d.definition_id, d.definition, l.logogram_base64, e.example_sentence
        FROM
            definitions d
                LEFT JOIN
            logograms l ON d.definition_id = l.definition_id
                LEFT JOIN
            examples e ON d.definition_id = e.definition_id
        WHERE
            d.word_id = ?
    `;
    db.all(sql, [req.params.wordId], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/example_sentences/:definitionId', (req, res) => {
    const sql = 'SELECT * FROM examples WHERE definition_id = ?';
    const params = [req.params.definitionId];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/components/:wordId', (req, res) => {
    const sql = `
        SELECT
            w.word, d.definition_id, d.definition, l.logogram_base64, e.example_sentence
        FROM
            components c
                JOIN
            definitions d ON c.component_definition_id = d.definition_id
                JOIN
            words w ON c.component_word_id = w.word_id
                LEFT JOIN
            logograms l ON d.definition_id = l.definition_id
                LEFT JOIN
            examples e ON d.definition_id = e.definition_id
        WHERE
            c.definition_id = ?
    `;
    db.all(sql, [req.params.wordId], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/logograms/:word', (req, res) => {
    const word = req.params.word;
    const sql = `
        SELECT
            d.definition_id, d.definition, l.logogram_base64, e.example_sentence, w.word
        FROM
            words w
                JOIN
            definitions d ON w.word_id = d.word_id
                LEFT JOIN
            logograms l ON d.definition_id = l.definition_id
                LEFT JOIN
            examples e ON d.definition_id = e.definition_id
        WHERE
            w.word = ?
    `;
    db.all(sql, [word], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/suggestions/:searchTerm', (req, res) => {
    const searchTerm = `${req.params.searchTerm}%`;
    const sql = 'SELECT word FROM words WHERE word LIKE ?';
    db.all(sql, [searchTerm], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/random', (req, res) => {
    const sql = `
        SELECT word FROM words
        ORDER BY RANDOM()
        LIMIT 1
    `;
    db.get(sql, [], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(row);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
