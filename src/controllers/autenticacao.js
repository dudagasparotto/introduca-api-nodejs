const db = require('../dataBase/connection');
const { criarToken } = require('../services/authToken');
const {
    protegerSenha,
    senhaEstaProtegida,
    verificarSenha
} = require('../services/senha');

module.exports = {
    async login(request, response) {
        try {
            const usuarioInformado = String(request.body.usuario || '').trim();
            const senhaInformada = String(request.body.senha || '');
            const tipoInformado = Number(request.body.tipoUsuario);

            if (!usuarioInformado || !senhaInformada || !tipoInformado) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Informe usuario, senha e tipo de usuario',
                    dados: null
                });
            }

            const [usuarios] = await db.query(
                `SELECT
                    id_usuario,
                    id_tipo_usuario,
                    id_motorista,
                    nome_usuario,
                    senha_usuario
                 FROM usuarios
                 WHERE nome_usuario = ?
                   AND id_tipo_usuario = ?
                 ORDER BY id_usuario ASC;`,
                [usuarioInformado, tipoInformado]
            );
            let usuario = null;

            for (const usuarioCandidato of usuarios) {
                if (
                    await verificarSenha(
                        senhaInformada,
                        usuarioCandidato.senha_usuario
                    )
                ) {
                    usuario = usuarioCandidato;
                    break;
                }
            }

            if (!usuario) {
                return response.status(401).json({
                    sucesso: false,
                    mensagem: 'Usuario ou senha invalidos',
                    dados: null
                });
            }

            if (!senhaEstaProtegida(usuario.senha_usuario)) {
                const senhaProtegida = await protegerSenha(senhaInformada);

                await db.query(
                    `UPDATE usuarios
                     SET senha_usuario = ?
                     WHERE id_usuario = ?;`,
                    [senhaProtegida, usuario.id_usuario]
                );
            }

            const token = criarToken(usuario);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Login realizado com sucesso',
                dados: {
                    token,
                    usuario: {
                        id_usuario: usuario.id_usuario,
                        id_tipo_usuario: usuario.id_tipo_usuario,
                        id_motorista: usuario.id_motorista,
                        nome_usuario: usuario.nome_usuario
                    }
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao realizar login: ${error.message}`,
                dados: null
            });
        }
    },

    async validar(request, response) {
        const tipoEsperado = request.query.tipoUsuario
            ? Number(request.query.tipoUsuario)
            : null;
        const usuario = request.usuarioAutenticado;

        if (tipoEsperado && usuario.tipoUsuario !== tipoEsperado) {
            return response.status(403).json({
                sucesso: false,
                mensagem: 'Usuario sem permissao para esta area',
                dados: null
            });
        }

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Sessao valida',
            dados: usuario
        });
    }
};
