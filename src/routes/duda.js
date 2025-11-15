const express = require('express');
const router =  express.Router();

const AvaliacaoController = require ('../controllers/Avaliacao');
const ManutencaoControllers = require ('../controllers/Manutencao');
const HorariosControllers = require ('../controllers/horarios');

router.get('/avaliacao', AvaliacaoController.listarAvaliacao);
router.post('/avaliacao', AvaliacaoController.cadastrarAvaliacao);
router.patch('/avaliacao', AvaliacaoController.atualizarAvaliacao);
router.delete('/avaliacao', AvaliacaoController.apagarAvaliacao);


router.get('/manutencao', ManutencaoControllers.listarManutencao);
router.post('/manutencao', ManutencaoControllers.cadastrarManutencao);
router.patch('/manutencao', ManutencaoControllers.atualizarManutencao);
router.delete('/manutencao', ManutencaoControllers.apagarManutencao);


router.get('/horarios', HorariosControllers.listarHorarios);
router.post('/horarios', HorariosControllers.cadastrarHorarios);
router.patch('/horarios', HorariosControllers.atualizarHorarios);
router.delete('/horarios', HorariosControllers.apagarHorarios);



module.exports = router;
