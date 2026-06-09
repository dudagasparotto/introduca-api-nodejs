const db = require('../dataBase/connection');

module.exports = {

    async listarTodasAvaliacoes(request, response) {

        try {

            const sql = `
                SELECT
                    a.id_avaliacao,
                    a.id_motorista,
                    m.nome_motorista,
                    a.nota_avaliacao,
                    a.comentario_avaliacao,
                    a.data_avaliacao
                FROM avaliacao a
                INNER JOIN motorista m
                    ON m.id_motorista = a.id_motorista
                ORDER BY
                    a.data_avaliacao DESC,
                    a.id_avaliacao DESC;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de avaliacoes obtida com sucesso',
                nItens: rows.length,
                dados: rows
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar avaliacoes: ${error.message}`,
                dados: []
            });

        }

    },

    // LISTAR
    async listarAvaliacao(request, response) {

    try {

        const { id_motorista } = request.params;

        const sql = `
            SELECT 
                id_avaliacao,
                id_motorista,
                nota_avaliacao,
                comentario_avaliacao,
                data_avaliacao
            FROM 
                avaliacao
            WHERE 
                id_motorista = ?
            ORDER BY data_avaliacao DESC;
        `;

        const values = [id_motorista];

        const [rows] =
            await db.query(sql, values);

        return response.status(200).json({

            sucesso: true,

            mensagem:
                'Lista de avaliações obtida com sucesso',

            nItens: rows.length,

            dados: rows

        });

        } catch (error) {

            return response.status(500).json({

                sucesso: false,

                mensagem:
                    `Erro ao listar avaliação: ${error.message}`,

                dados: null

            });

        }   

    },

    // MÉDIA
    async mediaAvaliacao(request, response) {

        try {

            const { id_motorista } =
                request.params;

            const sql = `
                SELECT 
                    ROUND(
                        AVG(nota_avaliacao),
                        1
                    ) AS media
                FROM avaliacao
                WHERE id_motorista = ?;
            `;

            const values = [id_motorista];

            const [rows] =
                await db.query(sql, values);

            return response.status(200).json({

                sucesso: true,

                media:
                    rows[0].media || 0

            });

        } catch (error) {

            return response.status(500).json({

                sucesso: false,

                mensagem:
                    `Erro ao calcular média: ${error.message}`,

                dados: null

            });

        }

    },

    // CADASTRAR
    async cadastrarAvaliacao(request, response) {

        try {

            const {
                id_motorista,
                nota_avaliacao,
                comentario_avaliacao
            } = request.body;
            const idMotorista = Number(id_motorista);
            const nota = Number(nota_avaliacao);
            const comentario = String(comentario_avaliacao || '').trim();

            if (!Number.isInteger(idMotorista) || idMotorista <= 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Motorista invalido.',
                    dados: null
                });
            }

            if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'A nota deve ser um numero inteiro entre 1 e 5.',
                    dados: null
                });
            }

            if (comentario.length > 255) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O comentario deve ter no maximo 255 caracteres.',
                    dados: null
                });
            }

            const [motoristas] = await db.query(
                'SELECT id_motorista FROM motorista WHERE id_motorista = ?;',
                [idMotorista]
            );

            if (motoristas.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Motorista nao encontrado.',
                    dados: null
                });
            }

            const sql = `
                INSERT INTO avaliacao 
                (
                    id_motorista,
                    nota_avaliacao,
                    comentario_avaliacao,
                    data_avaliacao
                ) 
                VALUES (?, ?, ?, NOW());
            `;

            const values = [
                idMotorista,
                nota,
                comentario || null
            ];

            const [result] =
                await db.query(sql, values);

            const [avaliacoes] = await db.query(
                `SELECT
                    id_avaliacao,
                    id_motorista,
                    nota_avaliacao,
                    comentario_avaliacao,
                    data_avaliacao
                FROM avaliacao
                WHERE id_avaliacao = ?;`,
                [result.insertId]
            );

            return response.status(201).json({

                sucesso: true,

                mensagem:
                    'Cadastro da avaliação realizado com sucesso',

                dados: avaliacoes[0]

            });

        } catch (error) {

            return response.status(500).json({

                sucesso: false,

                mensagem:
                    `Erro ao cadastrar avaliação: ${error.message}`,

                dados: error.message

            });

        }

    },

    // UPDATE
    async atualizarAvaliacao(request, response) {

        try {

            const {
                id_motorista,
                nota_avaliacao,
                comentario_avaliacao,
                data_avaliacao
            } = request.body;

            const { id } =
                request.params;

            const sql = `
                UPDATE avaliacao
                SET
                    id_motorista = ?,
                    nota_avaliacao = ?,
                    comentario_avaliacao = ?,
                    data_avaliacao = ?
                WHERE 
                    id_avaliacao = ?;
            `;

            const values = [

                id_motorista,

                nota_avaliacao,

                comentario_avaliacao,

                data_avaliacao,

                id

            ];

            const [result] =
                await db.query(sql, values);

            if (result.affectedRows === 0) {

                return response.status(404).json({

                    sucesso: false,

                    mensagem:
                        `Avaliação ${id} não encontrada`,

                    dados: null

                });

            }

            return response.status(200).json({

                sucesso: true,

                mensagem:
                    `Avaliação ${id} atualizada com sucesso`

            });

        } catch (error) {

            return response.status(500).json({

                sucesso: false,

                mensagem:
                    `Erro ao atualizar avaliação: ${error.message}`,

                dados: error.message

            });

        }

    },

    // DELETE
    async apagarAvaliacao(request, response) {

        try {

            const { id } =
                request.params;

            const sql = `
                DELETE FROM avaliacao
                WHERE id_avaliacao = ?;
            `;

            const values = [id];

            const [result] =
                await db.query(sql, values);

            if (result.affectedRows === 0) {

                return response.status(404).json({

                    sucesso: false,

                    mensagem:
                        `Avaliação ${id} não encontrada`,

                    dados: null

                });

            }

            return response.status(200).json({

                sucesso: true,

                mensagem:
                    `Avaliação ${id} apagada com sucesso`

            });

        } catch (error) {

            return response.status(500).json({

                sucesso: false,

                mensagem:
                    `Erro ao apagar avaliação: ${error.message}`,

                dados: error.message

            });

        }

    }

};
