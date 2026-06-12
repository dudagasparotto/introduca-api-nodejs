const db = require('../dataBase/connection');
const { verificarToken } = require('../services/authToken');

function responderNaoAutorizado(response, mensagem = 'Sessao invalida ou expirada') {
    return response.status(401).json({
        sucesso: false,
        mensagem,
        dados: null
    });
}

async function autenticar(request, response, next) {
    const autorizacao = request.headers.authorization || '';
    const [tipo, token] = autorizacao.split(' ');

    if (tipo !== 'Bearer' || !token) {
        return responderNaoAutorizado(response, 'Autenticacao obrigatoria');
    }

    try {
        const payload = verificarToken(token);
        const [usuarios] = await db.query(
            `SELECT
                id_usuario,
                id_tipo_usuario,
                id_motorista,
                nome_usuario
             FROM usuarios
             WHERE id_usuario = ?
             LIMIT 1;`,
            [payload.idUsuario]
        );
        const usuario = usuarios[0];

        if (
            !usuario ||
            Number(usuario.id_tipo_usuario) !== Number(payload.tipoUsuario)
        ) {
            return responderNaoAutorizado(response);
        }

        request.usuarioAutenticado = {
            idUsuario: Number(usuario.id_usuario),
            idMotorista: usuario.id_motorista
                ? Number(usuario.id_motorista)
                : null,
            nomeUsuario: usuario.nome_usuario,
            tipoUsuario: Number(usuario.id_tipo_usuario)
        };

        return next();
    } catch {
        return responderNaoAutorizado(response);
    }
}

function exigirTipo(tipoUsuario) {
    return function verificarTipo(request, response, next) {
        if (
            Number(request.usuarioAutenticado?.tipoUsuario) !==
            Number(tipoUsuario)
        ) {
            return response.status(403).json({
                sucesso: false,
                mensagem: 'Acesso negado para este tipo de usuario',
                dados: null
            });
        }

        return next();
    };
}

const exigirAdmin = exigirTipo(1);

module.exports = {
    autenticar,
    exigirAdmin,
    exigirTipo
};
