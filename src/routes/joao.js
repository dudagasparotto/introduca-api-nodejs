const express = require('express');
const router = express.Router();

const OnibusController = require('../controllers/usuarios');
const PontosController = require('../controllers/produtos');
const LocalizacaoController = require('../controllers/produtos');

router.get('/onibus', OnibusController.listarOnibus);
router.post('/onibus', OnibusController.cadastrarOnibus);
router.patch('/onibus', OnibusController.editarOnibus);
router.delete('/onibus', OnibusController.apagarOnibus);

router.get('/pontos', PontosController.listarPontos);
router.post('/pontos', PontosController.cadastrarPontos);
router.patch('/pontos', PontosController.editarPontos);
router.delete('/pontos', PontosController.apagarPontos);

router.get('/localizacao', LocalizacaoController.listarLocalizacao);
router.post('/localizacao', LocalizacaoController.cadastrarLocalizacao);
router.patch('/localizacao', LocalizacaoController.editarLocalizacao);
router.delete('/localizacao', LocalizacaoController.apagarLocalizacao);

module.exports = router;