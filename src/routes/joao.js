const express = require('express');
const router = express.Router();

const OnibusController = require('../controllers/onibus');
const PontosController = require('../controllers/pontos');
const LocalizacaoController = require('../controllers/localizacao');

router.get('/onibus', OnibusController.listaronibus);
router.post('/onibus', OnibusController.cadastraronibus);
router.patch('/onibus/:id', OnibusController.editaronibus);
router.delete('/onibus', OnibusController.apagaronibus);

router.get('/pontos', PontosController.listarpontos);
router.post('/pontos', PontosController.cadastrarpontos);
router.patch('/pontos/:id', PontosController.editarpontos);
router.delete('/pontos/:id', PontosController.apagarpontos);

module.exports = router;
