const express = require('express'); 
const path = require('path');
const multer = require('multer');
const router = express.Router();

const motoristaController = require('../controllers/motorista');
const usuariosController = require('../controllers/usuarios');
const tiposdeUsuariosController = require('../controllers/tiposdeUsuario');
const { autenticar, exigirAdmin } = require('../middlewares/autenticacao');

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
router.put(
    '/motoristas/:id/rotas',
    autenticar,
    exigirAdmin,
    motoristaController.atualizarRotasDoMotorista
);
router.get('/motoristas/:id', motoristaController.buscarMotorista);
router.post(
    '/motoristas',
    autenticar,
    exigirAdmin,
    uploadMotorista.single('foto'),
    motoristaController.cadastrarMotorista
);
router.patch(
    '/motoristas/:id',
    autenticar,
    exigirAdmin,
    uploadMotorista.single('foto'),
    motoristaController.atualizarMotorista
);
router.delete(
    '/motoristas/:id',
    autenticar,
    exigirAdmin,
    motoristaController.apagarMotorista
);

router.get('/usuarios', autenticar, exigirAdmin, usuariosController.listarUsuario);
router.post('/usuarios', autenticar, exigirAdmin, usuariosController.cadastrarUsuario);
router.patch(
    '/usuarios/:id',
    autenticar,
    exigirAdmin,
    usuariosController.atualizarUsuario
);
router.delete(
    '/usuarios/:id',
    autenticar,
    exigirAdmin,
    usuariosController.apagarUsuario
);

router.get(
    '/tiposdeusuarios',
    autenticar,
    exigirAdmin,
    tiposdeUsuariosController.listarTiposdeUsuario
);
router.post(
    '/tiposdeusuarios',
    autenticar,
    exigirAdmin,
    tiposdeUsuariosController.cadastrarTiposdeUsuario
);
router.patch(
    '/tiposdeusuarios/:id',
    autenticar,
    exigirAdmin,
    tiposdeUsuariosController.atualizarTiposdeUsuario
);
router.delete(
    '/tiposdeusuarios/:id',
    autenticar,
    exigirAdmin,
    tiposdeUsuariosController.apagarTiposdeUsuario
);


module.exports = router;
