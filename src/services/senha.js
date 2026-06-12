const crypto = require('crypto');
const { promisify } = require('util');

const scrypt = promisify(crypto.scrypt);
const PREFIXO = 'scrypt';

function senhaEstaProtegida(senha) {
    return String(senha || '').startsWith(`${PREFIXO}$`);
}

async function protegerSenha(senha) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = await scrypt(String(senha), salt, 32);

    return `${PREFIXO}$${salt}$${hash.toString('hex')}`;
}

async function verificarSenha(senhaInformada, senhaSalva) {
    const valorSalvo = String(senhaSalva || '');

    if (!senhaEstaProtegida(valorSalvo)) {
        const informada = Buffer.from(String(senhaInformada));
        const salva = Buffer.from(valorSalvo);

        return (
            informada.length === salva.length &&
            crypto.timingSafeEqual(informada, salva)
        );
    }

    const [, salt, hashHex] = valorSalvo.split('$');

    if (!salt || !hashHex) {
        return false;
    }

    const hashInformado = await scrypt(String(senhaInformada), salt, 32);
    const hashSalvo = Buffer.from(hashHex, 'hex');

    return (
        hashInformado.length === hashSalvo.length &&
        crypto.timingSafeEqual(hashInformado, hashSalvo)
    );
}

module.exports = {
    protegerSenha,
    senhaEstaProtegida,
    verificarSenha
};
