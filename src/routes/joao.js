const express = require('express');
const router = express.Router();

const OnibusController = require('../controllers/onibus');
const PontosController = require('../controllers/pontos');
const LocalizacaoController = require('../controllers/localizacao');

router.get('/onibus', OnibusController.listaronibus);
router.post('/onibus', OnibusController.cadastraronibus);
router.patch('/onibus', OnibusController.editaronibus);
router.delete('/onibus', OnibusController.apagaronibus);

router.get('/pontos', PontosController.listarpontos);
router.post('/pontos', PontosController.cadastrarpontos);
router.patch('/pontos', PontosController.editarpontos);
router.delete('/pontos', PontosController.apagarpontos);

router.get('/localizacao', LocalizacaoController.listarlocalizacao);
router.post('/localizacao', LocalizacaoController.cadastrarlocalizacao);
router.patch('/localizacao', LocalizacaoController.editarlocalizacao);
router.delete('/localizacao', LocalizacaoController.apagarlocalizacao);

module.exports = router;