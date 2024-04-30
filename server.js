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

// Ruta PUT para actualizar un post existente
app.put('/posts/:id', async (req, res) => {
  const { id } = req.params; // ID del post a modificar
  const { titulo, img, descripcion, likes } = req.body; // Nuevos valores para el post

  try {
    const { rows } = await pool.query(
      'UPDATE posts SET titulo = $1, img = $2, descripcion = $3, likes = $4 WHERE id = $5 RETURNING *',
      [titulo, img, descripcion, likes, id]
    );
    if(rows.length === 0) {
      res.status(404).send('Post no encontrado.');
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta DELETE para eliminar un post
app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params; // ID del post a eliminar

  try {
    const { rowCount } = await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    if(rowCount === 0) {
      res.status(404).send('Post no encontrado.');
    } else {
      res.status(204).send(); // No content to send back
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
