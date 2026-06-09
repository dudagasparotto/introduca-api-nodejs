const express = require('express');
const router = express.Router();

const RotasController = require('../controllers/rotas');
const LinhasController = require('../controllers/linhas');

router.get('/rotas', RotasController.listarrotas);
router.get('/motoristas-rotas', RotasController.listarVinculosMotoristasRotas);
router.get('/rotas-com-pontos', RotasController.listarRotasComPontos);
router.get('/rotas/:id/detalhes', RotasController.buscarDetalhesDaRota);
router.get('/rotas/:id/motoristas', RotasController.listarMotoristasDaRota);
router.post('/rotas', RotasController.cadastrarrotas);
router.patch('/rotas/:id', RotasController.editarrotas);
router.delete('/rotas/:id', RotasController.apagarrotas);

router.get('/linhas', LinhasController.listarlinhas);
router.post('/linhas', LinhasController.cadastrarlinhas);
router.patch('/linhas/:id', LinhasController.editarlinhas);
router.delete('/linhas/:id', LinhasController.apagarlinhas);


module.exports = router;
