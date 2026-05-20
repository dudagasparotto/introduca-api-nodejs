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

    const [columns] = await db.query(
        "SHOW COLUMNS FROM pontos LIKE 'id_rota'"
    );

    if (columns.length === 0) {
        await db.query(
            'ALTER TABLE pontos ADD COLUMN id_rota MEDIUMINT NULL'
        );
    }

    const [foreignKeys] = await db.query(`
        SELECT CONSTRAINT_NAME
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'pontos'
          AND COLUMN_NAME = 'id_rota'
          AND REFERENCED_TABLE_NAME = 'rotas';
    `);

    if (foreignKeys.length === 0) {
        await db.query(`
            ALTER TABLE pontos
            ADD CONSTRAINT fk_pontos_rota
            FOREIGN KEY (id_rota) REFERENCES rotas(id_rota);
        `);
    }

    await db.query(`
        UPDATE pontos p
        INNER JOIN rotas r ON r.id_ponto = p.id_pontos
        SET p.id_rota = r.id_rota
        WHERE p.id_rota IS NULL;
    `);

    await db.end();
    console.log('Migração pontos.id_rota aplicada');
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
