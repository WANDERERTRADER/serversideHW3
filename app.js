const express = require('express');
const mysql = require('mysql2');
const bodyParser = require("body-parser");
require('dotenv').config();
const app = express();
app.use(bodyParser.json());


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

app.get('/', (req, res) => {
    res.send('Hello Node.JS');
});

app.get('/products', (req, res) => {
    db.query('SELECT * FROM products WHERE is_deleted = 0', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/products/:id', (req, res) => {
    db.query(
        'SELECT * FROM products WHERE id = ? AND is_deleted = 0'
        [req.params.id],
            (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(results[ø] || {});
            }
        );
});

app.get('/products/search/:keyword', (req, res) => {
    const keyword = `%${req.params.keyword}%`;
    db.query(
    'SELECT * FROM products WHERE name LIKE ? AND.is_deleted .= 0',
    [keyword],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        }
    );
});

app.post('/products', (req, res) => {
        const { name, price, discount, review_count, image_url } = req.body;
        db.query(
            'INSERT INTO products (name, price, discount, review_count, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, price, discount, review_count, image_url],
                (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.status(201).json({ id: result.insertId, message: 'Product created' });
            }
    );
});

app.put('/products/:id', (req, res) => {
    const { name, price, discount, review_count, image_url } = req.body;
    db.query(
        'UPDATE products SET name = ?, price = ?, discount = ?, review_count = ?, image_url = ? WHERE id = ?',
        [name, price, discount, review_count, image_url, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Product updated' });
        }
    );
});


app.delete('/products/:id', (req, res) => {
db.query(
    'UPDATE products SET is_deleted = 1 WHERE id = ?',
    [req.params. id],
    (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res. json({ message: 'Product soft-deleted' });
        }
    );
});

app.put('/products/restore/:id', (req, res) => {
db.query(
'UPDATE products SET is_deleted = 0 WHERE id = ?',
    [req.params. id],
        (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Product restored' });
        }
    );
});
app.listen(3000, () => console.log('Server running on port 3000'))