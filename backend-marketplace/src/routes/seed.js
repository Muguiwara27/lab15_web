const express = require('express');
const router = express.Router();
const seed = require('../seeders/seed');

router.get('/run-seed', async (req, res) => {
  try {
    await seed();
    res.json({ message: 'Seed ejecutado exitosamente. Base de datos poblada.' });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: 'Error al ejecutar seed', error: error.message });
  }
});

module.exports = router;
