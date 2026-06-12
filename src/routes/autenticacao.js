const express = require('express');
const router = express.Router();

const AutenticacaoController = require('../controllers/autenticacao');
const { autenticar } = require('../middlewares/autenticacao');

router.post('/auth/login', AutenticacaoController.login);
router.get('/auth/validar', autenticar, AutenticacaoController.validar);

module.exports = router;
