const crypto = require('crypto');

const DURACAO_TOKEN_SEGUNDOS = 8 * 60 * 60;

function obterSegredo() {
    const segredo = process.env.AUTH_SECRET;

    if (!segredo || segredo.length < 32) {
        throw new Error('AUTH_SECRET precisa ter pelo menos 32 caracteres');
    }

    return segredo;
}

function codificarBase64Url(valor) {
    return Buffer.from(valor)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function decodificarBase64Url(valor) {
    const base64 = valor.replace(/-/g, '+').replace(/_/g, '/');
    const preenchimento = '='.repeat((4 - (base64.length % 4)) % 4);

    return Buffer.from(`${base64}${preenchimento}`, 'base64').toString('utf8');
}

function assinar(conteudo) {
    return codificarBase64Url(
        crypto.createHmac('sha256', obterSegredo()).update(conteudo).digest()
    );
}

function criarToken(usuario) {
    const agora = Math.floor(Date.now() / 1000);
    const payload = {
        idUsuario: Number(usuario.id_usuario),
        idMotorista: usuario.id_motorista
            ? Number(usuario.id_motorista)
            : null,
        nomeUsuario: usuario.nome_usuario,
        tipoUsuario: Number(usuario.id_tipo_usuario),
        iat: agora,
        exp: agora + DURACAO_TOKEN_SEGUNDOS
    };
    const payloadCodificado = codificarBase64Url(JSON.stringify(payload));

    return `${payloadCodificado}.${assinar(payloadCodificado)}`;
}

function verificarToken(token) {
    if (!token || typeof token !== 'string') {
        throw new Error('Token ausente');
    }

    const partes = token.split('.');

    if (partes.length !== 2) {
        throw new Error('Token invalido');
    }

    const [payloadCodificado, assinaturaRecebida] = partes;
    const assinaturaEsperada = assinar(payloadCodificado);
    const bufferRecebido = Buffer.from(assinaturaRecebida);
    const bufferEsperado = Buffer.from(assinaturaEsperada);

    if (
        bufferRecebido.length !== bufferEsperado.length ||
        !crypto.timingSafeEqual(bufferRecebido, bufferEsperado)
    ) {
        throw new Error('Assinatura invalida');
    }

    const payload = JSON.parse(decodificarBase64Url(payloadCodificado));
    const agora = Math.floor(Date.now() / 1000);

    if (!payload.exp || payload.exp <= agora) {
        throw new Error('Token expirado');
    }

    return payload;
}

module.exports = {
    criarToken,
    verificarToken
};
