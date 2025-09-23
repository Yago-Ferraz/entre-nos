const express = require('express');
const router = express.Router();

router.post('/forgot-password', (req, res) => {
  // Lógica para enviar o e-mail
  res.json({ message: 'Instruções enviadas para o seu e-mail.' });
});


module.exports = router;