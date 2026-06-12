const express = require('express');
const router = express.Router();

const OnibusController = require('../controllers/onibus');
const PontosController = require('../controllers/pontos');
const { autenticar, exigirAdmin } = require('../middlewares/autenticacao');

router.get('/onibus', OnibusController.listaronibus);
router.post('/onibus', autenticar, exigirAdmin, OnibusController.cadastraronibus);
router.patch(
    '/onibus/:id',
    autenticar,
    exigirAdmin,
    OnibusController.editaronibus
);
router.delete('/onibus', autenticar, exigirAdmin, OnibusController.apagaronibus);

router.get('/pontos', PontosController.listarpontos);
router.post('/pontos', autenticar, exigirAdmin, PontosController.cadastrarpontos);
router.patch(
    '/pontos/:id',
    autenticar,
    exigirAdmin,
    PontosController.editarpontos
);
router.delete(
    '/pontos/:id',
    autenticar,
    exigirAdmin,
    PontosController.apagarpontos
);

module.exports = router;
