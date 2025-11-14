const express = require('express');
const router = express.Router();

const RotaOnibusController = require('../controllers/rotaOnibus');
const RotasController = require('../controllers/rotas');
const LinhasController = require('../controllers/linhas');

router.get('/rotaOnibus', RotaOnibusController.listarrotaOnibus);
router.post('/rotaOnibus', RotaOnibusController.cadastrarrotaOnibus);
router.patch('/rotaOnibus', RotaOnibusController.editarrotaOnibus);
router.delete('/rotaOnibus', RotaOnibusController.apagarrotaOnibus);

router.get('/rotas', RotasController.listarrotas);
router.post('/rotas', RotasController.cadastrarrotas);
router.patch('/rotas', RotasController.editarrotas);
router.delete('/rotas', RotasController.apagarrotas);

router.get('/linhas', LinhasController.listarlinhas);
router.post('/linhas', LinhasController.cadastrarlinhas);
router.patch('/linhas', LinhasController.editarlinhas);
router.delete('/linhas', LinhasController.apagarlinhas);


module.exports = router;