const express = require('express');
const router =  express.Router();

const AvaliacaoController = require ('../controllers/Avaliacao');
// const ManutencaoControllers = require ('../controllers/Manutencao');
const HorariosControllers = require ('../controllers/horarios');
const { autenticar, exigirAdmin } = require('../middlewares/autenticacao');

router.get('/avaliacao/:id_motorista', AvaliacaoController.listarAvaliacao);
router.get('/avaliacoes', AvaliacaoController.listarTodasAvaliacoes);
router.get('/mediaAvaliacao/:id_motorista', AvaliacaoController.mediaAvaliacao);
router.post('/avaliacao', AvaliacaoController.cadastrarAvaliacao);
router.patch(
    '/avaliacao/:id',
    autenticar,
    exigirAdmin,
    AvaliacaoController.atualizarAvaliacao
);
router.delete(
    '/avaliacao/:id',
    autenticar,
    exigirAdmin,
    AvaliacaoController.apagarAvaliacao
);


// router.get('/manutencao', ManutencaoControllers.listarManutencao);
// router.post('/manutencao', ManutencaoControllers.cadastrarManutencao);
// router.patch('/manutencao/:id', ManutencaoControllers.atualizarManutencao);
// router.delete('/manutencao/:id', ManutencaoControllers.apagarManutencao);


router.get('/horarios', HorariosControllers.listarHorarios);
router.get('/pontos/:id/horarios', HorariosControllers.listarHorariosDoPonto);
router.post(
    '/horarios',
    autenticar,
    exigirAdmin,
    HorariosControllers.cadastrarHorarios
);
router.patch(
    '/horarios/:id',
    autenticar,
    exigirAdmin,
    HorariosControllers.atualizarHorarios
);
router.put(
    '/horarios/:id',
    autenticar,
    exigirAdmin,
    HorariosControllers.atualizarHorarios
);
router.delete(
    '/horarios/:id',
    autenticar,
    exigirAdmin,
    HorariosControllers.apagarHorarios
);



module.exports = router;
