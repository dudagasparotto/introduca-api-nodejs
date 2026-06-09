const express = require('express'); 
const path = require('path');
const multer = require('multer');
const router = express.Router();

const motoristaController = require('../controllers/motorista');
const usuariosController = require('../controllers/usuarios');
const tiposdeUsuariosController = require('../controllers/tiposdeUsuario');

const uploadMotorista = multer({
    storage: multer.diskStorage({
        destination: path.join(__dirname, '../../public/fotos/motoristas'),
        filename: (request, file, callback) => {
            const extensao = path.extname(file.originalname).toLowerCase();
            callback(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${extensao}`);
        }
    }),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (request, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
            return callback(new Error('O arquivo enviado precisa ser uma imagem.'));
        }

        return callback(null, true);
    }
});

router.get('/motoristas/', motoristaController.listarMotorista);
router.get('/motoristas/:id/rotas', motoristaController.listarRotasDoMotorista);
router.put('/motoristas/:id/rotas', motoristaController.atualizarRotasDoMotorista);
router.get('/motoristas/:id', motoristaController.buscarMotorista);
router.post(
    '/motoristas',
    uploadMotorista.single('foto'),
    motoristaController.cadastrarMotorista
);
router.patch(
    '/motoristas/:id',
    uploadMotorista.single('foto'),
    motoristaController.atualizarMotorista
);
router.delete('/motoristas/:id', motoristaController.apagarMotorista);

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
