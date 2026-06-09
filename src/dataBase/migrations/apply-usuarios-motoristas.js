const fs = require('fs');
const path = require('path');

const db = require('../connection');

async function aplicarMigration() {
    const migrationPath = path.join(
        __dirname,
        '2026-06-08-usuarios-motoristas.sql'
    );
    const comandos = fs
        .readFileSync(migrationPath, 'utf8')
        .split(';')
        .map((comando) => comando.trim())
        .filter(Boolean);

    try {
        for (const comando of comandos) {
            await db.query(comando);
        }

        console.log('Migration de usuarios e motoristas aplicada com sucesso.');
    } finally {
        await db.end();
    }
}

aplicarMigration().catch((error) => {
    console.error('Erro ao aplicar migration:', error.message);
    process.exitCode = 1;
});
