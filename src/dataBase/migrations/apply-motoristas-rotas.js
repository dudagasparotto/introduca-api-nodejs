const fs = require('fs');
const path = require('path');
const db = require('../connection');

async function main() {
    const migrationPath = path.join(__dirname, '2026-05-27-motoristas-rotas.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    const statements = sql
        .split(';')
        .map((statement) => statement.trim())
        .filter(Boolean);

    for (const statement of statements) {
        await db.query(statement);
    }

    console.log('Tabela motoristas_rotas criada e preenchida.');
    process.exit(0);
}

main().catch((error) => {
    console.error('Erro ao aplicar migration motoristas_rotas:', error.message);
    process.exit(1);
});
