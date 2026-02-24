router.get('/usuarios', UsuariosController.listarUsuarios);
router.post('/usuarios', UsuariosController.cadastrarUsuarios);
router.patch('/usuarios/:id', UsuariosController.editarUsuarios);
router.delete('/usuarios/:id', UsuariosController.apagarUsuarios);
router.delete('/usuarios/:del/:id', UsuariosController.ocultarUsuarios);
router.get('/login', UsuariosController.login); //query