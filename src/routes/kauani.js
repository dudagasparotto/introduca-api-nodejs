const express = require('express'); 
const router = express.Router();

const motoristaController = require('../controllers/motorista');
const usuariosController = require('../controllers/usuarios');
const tiposdeUsuariosController = require('../controllers/tiposdeUsuario');

router.get('/motoristas', motoristaController.listarMotorista);
router.post('/motoristas', motoristaController.cadastrarMotorista);
router.patch('/motoristas', motoristaController.atualizarMotorista);
router.delete('/motoristas', motoristaController.apagarMotorista);

router.get('/usuarios', usuariosController.listarUsuario);
router.post('/usuarios', usuariosController.cadastrarUsuario);
router.patch('/usuarios', usuariosController.atualizarUsuario);
router.delete('/usuarios', usuariosController.apagarUsuario);
router.get('/login', usuariosController.login);

router.get('/tiposdeusuarios', tiposdeUsuariosController.listarTiposdeUsuario);
router.post('/tiposdeusuarios', tiposdeUsuariosController.cadastrarTiposdeUsuario);
router.patch('/tiposdeusuarios', tiposdeUsuariosController.atualizarTiposdeUsuario);
router.delete('/tiposdeusuarios', tiposdeUsuariosController.apagarTiposdeUsuario);


module.exports = router;