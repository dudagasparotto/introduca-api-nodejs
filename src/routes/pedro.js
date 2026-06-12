const express = require('express');
const router = express.Router();

const RotasController = require('../controllers/rotas');
const LinhasController = require('../controllers/linhas');
const { autenticar, exigirAdmin } = require('../middlewares/autenticacao');

router.get('/rotas', RotasController.listarrotas);
router.get('/motoristas-rotas', RotasController.listarVinculosMotoristasRotas);
router.get('/rotas-com-pontos', RotasController.listarRotasComPontos);
router.get('/rotas/:id/detalhes', RotasController.buscarDetalhesDaRota);
router.get('/rotas/:id/motoristas', RotasController.listarMotoristasDaRota);
router.post('/rotas', autenticar, exigirAdmin, RotasController.cadastrarrotas);
router.patch(
    '/rotas/:id',
    autenticar,
    exigirAdmin,
    RotasController.editarrotas
);
router.delete(
    '/rotas/:id',
    autenticar,
    exigirAdmin,
    RotasController.apagarrotas
);

router.get('/linhas', LinhasController.listarlinhas);
router.post('/linhas', autenticar, exigirAdmin, LinhasController.cadastrarlinhas);
router.patch(
    '/linhas/:id',
    autenticar,
    exigirAdmin,
    LinhasController.editarlinhas
);
router.delete(
    '/linhas/:id',
    autenticar,
    exigirAdmin,
    LinhasController.apagarlinhas
);


module.exports = router;
