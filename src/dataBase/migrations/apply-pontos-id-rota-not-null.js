require('dotenv').config();
const mysql = require('mysql2/promise');

async function main() {
    const db = await mysql.createConnection({
        host: process.env.BD_SERVIDOR,
        port: process.env.BD_PORTA,
        user: process.env.BD_USUARIO,
        password: process.env.BD_SENHA,
        database: process.env.BD_BANCO
    });

    const [rotas] = await db.query(
        'SELECT id_rota FROM rotas ORDER BY id_rota'
    );

    if (rotas.length === 0) {
        throw new Error('Não há rotas cadastradas para vincular aos pontos.');
    }

    const [pontosSemRota] = await db.query(
        'SELECT id_pontos FROM pontos WHERE id_rota IS NULL ORDER BY id_pontos'
    );

    for (let index = 0; index < pontosSemRota.length; index += 1) {
        const ponto = pontosSemRota[index];
        const rota = rotas[index % rotas.length];

        await db.query(
            'UPDATE pontos SET id_rota = ? WHERE id_pontos = ?',
            [rota.id_rota, ponto.id_pontos]
        );
    }

    await db.query(
        'ALTER TABLE pontos MODIFY COLUMN id_rota MEDIUMINT NOT NULL'
    );

    await db.end();
    console.log('Pontos distribuídos entre rotas e id_rota definido como NOT NULL');
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
