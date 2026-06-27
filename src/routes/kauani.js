const express = require('express'); 
const router = express.Router();

const motoristaController = require('../controllers/motorista');
const usuariosController = require('../controllers/usuarios');
const tiposdeUsuariosController = require('../controllers/tiposdeUsuario');
const upload = require('../middlewares/upload');
const motoristasRotasController = require('../controllers/motoristasRotas');

router.get('/motoristas', motoristaController.listarMotorista);
router.post('/motoristas', upload.single('foto'), motoristaController.cadastrarMotorista);
router.patch('/motoristas/:id', upload.single('foto'), motoristaController.atualizarMotorista);
router.delete('/motoristas/:id', motoristaController.apagarMotorista);
router.get('/motoristas/:id', motoristaController.buscarMotorista);
router.get('/motoristas-rotas', motoristasRotasController.listar);
router.get('/motoristas/:id/rotas', motoristasRotasController.listarPorMotorista);
router.put('/motoristas/:id/rotas', motoristasRotasController.substituir);

router.get('/usuarios', usuariosController.listarUsuario);
router.post('/usuarios', usuariosController.cadastrarUsuario);
router.patch('/usuarios/:id', usuariosController.atualizarUsuario);
router.delete('/usuarios/:id', usuariosController.apagarUsuario);
router.get('/login', usuariosController.login);

router.get('/tiposdeusuarios', tiposdeUsuariosController.listarTiposdeUsuario);
router.post('/tiposdeusuarios', tiposdeUsuariosController.cadastrarTiposdeUsuario);
router.patch('/tiposdeusuarios/:id', tiposdeUsuariosController.atualizarTiposdeUsuario);
router.delete('/tiposdeusuarios/:id', tiposdeUsuariosController.apagarTiposdeUsuario);


module.exports = router;
