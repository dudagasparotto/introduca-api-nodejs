const express = require('express');
const router =  express.Router();

const AvaliacaoController = require ('../controllers/Avaliacao');
const ManutencaoControllers = require ('../controllers/Manutencao');
const HorariosControllers = require ('../controllers/horarios');

router.get('/avaliacao', AvaliacaoController.listarAvaliacao);
router.post('/avaliacao', AvaliacaoController.cadastrarAvaliacao);
router.patch('/avaliacao/:id', AvaliacaoController.atualizarAvaliacao);
router.delete('/avaliacao/:id', AvaliacaoController.apagarAvaliacao);


router.get('/manutencao', ManutencaoControllers.listarManutencao);
router.post('/manutencao', ManutencaoControllers.cadastrarManutencao);
router.patch('/manutencao/:id', ManutencaoControllers.atualizarManutencao);
router.delete('/manutencao/:id', ManutencaoControllers.apagarManutencao);


router.get('/horarios', HorariosControllers.listarHorarios);
router.post('/horarios', HorariosControllers.cadastrarHorarios);
router.patch('/horarios/:id', HorariosControllers.atualizarHorarios);
router.delete('/horarios/:id', HorariosControllers.apagarHorarios);



module.exports = router;
