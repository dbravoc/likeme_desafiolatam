//HICE PRUEBAS Y ME FUNCIONA CORRECTAMENTE EN POSTMAN PARA CREAR NUEVOS REGISTROS Y EN SQL PARA CONSULTAR.

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: 'localhost',
  database: 'likeme',
  port: 5432,
});

// Rutas

// Ruta GET para consultar los posts existentes
app.get('/posts', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta POST para agregar un nuevo post
app.post('/posts', async (req, res) => {
  const { titulo, img, descripcion, likes } = req.body;
  try {
    const { rows } = await pool.query('INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *', [titulo, img, descripcion, likes]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
