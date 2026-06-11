require('dotenv').config();

const db = require('../connection');

async function colunaExiste(nomeColuna) {
    const [colunas] = await db.query(
        `
            SELECT COLUMN_NAME
            FROM information_schema.COLUMNS
            WHERE
                TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = 'rotas'
                AND COLUMN_NAME = ?;
        `,
        [nomeColuna]
    );

    return colunas.length > 0;
}

async function aplicarMigration() {
    try {
        if (!(await colunaExiste('cor'))) {
            await db.query(`
                ALTER TABLE rotas
                ADD COLUMN cor VARCHAR(7) NOT NULL DEFAULT '#6B7280' AFTER mapa;
            `);
        }

        if (!(await colunaExiste('trajeto'))) {
            await db.query(`
                ALTER TABLE rotas
                ADD COLUMN trajeto LONGTEXT NULL AFTER cor;
            `);
        }

        await db.query(`
            UPDATE rotas
            SET cor = CASE id_rota
                WHEN 1 THEN '#7C3AED'
                WHEN 2 THEN '#2563EB'
                WHEN 3 THEN '#EA580C'
                WHEN 4 THEN '#EAB308'
                ELSE cor
            END
            WHERE id_rota IN (1, 2, 3, 4);
        `);

        console.log('Migration de cor e trajeto das rotas aplicada com sucesso.');
    } catch (error) {
        console.error('Erro ao aplicar migration de rotas:', error.message);
        process.exitCode = 1;
    } finally {
        await db.end();
    }
}

aplicarMigration();
