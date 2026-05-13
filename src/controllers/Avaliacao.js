const db = require('../dataBase/connection');

module.exports = {

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
                comentario_avaliacao,
                data_avaliacao
            } = request.body;

            const sql = `
                INSERT INTO avaliacao 
                (
                    id_motorista,
                    nota_avaliacao,
                    comentario_avaliacao,
                    data_avaliacao
                ) 
                VALUES (?, ?, ?, ?);
            `;

            const values = [
                id_motorista,
                nota_avaliacao,
                comentario_avaliacao,
                data_avaliacao
            ];

            const [result] =
                await db.query(sql, values);

            const dados = {

                id: result.insertId,

                id_motorista,

                nota_avaliacao,

                comentario_avaliacao,

                data_avaliacao

            };

            return response.status(200).json({

                sucesso: true,

                mensagem:
                    'Cadastro da avaliação realizado com sucesso',

                dados

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