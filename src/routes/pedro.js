const express = require('express');
const router = express.Router();

const RotaOnibusController = require('../controllers/rotaOnibus');
const RotasController = require('../controllers/rotas');
const LinhasController = require('../controllers/linhas');

router.get('/rotaOnibus', RotaOnibusController.listarrotaOnibus);
router.post('/rotaOnibus', RotaOnibusController.cadastrarrotaOnibus);
router.patch('/rotaOnibus/:id', RotaOnibusController.editarrotaOnibus);
router.delete('/rotaOnibus/:id', RotaOnibusController.apagarrotaOnibus);

router.get('/rotas', RotasController.listarrotas);
router.post('/rotas', RotasController.cadastrarrotas);
router.patch('/rotas/:id', RotasController.editarrotas);
router.delete('/rotas/:id', RotasController.apagarrotas);

router.get('/linhas', LinhasController.listarlinhas);
router.post('/linhas', LinhasController.cadastrarlinhas);
router.patch('/linhas/:id', LinhasController.editarlinhas);
router.delete('/linhas/:id', LinhasController.apagarlinhas);


module.exports = router;