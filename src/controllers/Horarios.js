const db = require('../dataBase/connection');

module.exports = {

    async listarHorarios(request, response) {

        try {

            const sql = `
                SELECT
                    h.id_horario,
                    h.id_ponto,
                    h.passagem_horarios,

                    p.id_pontos,
                    p.nome_pontos,

                    l.id_linha,
                    l.nome_linhas

                FROM horarios h

                INNER JOIN pontos p
                    ON h.id_ponto = p.id_pontos

                INNER JOIN linhas l
                    ON p.id_linha = l.id_linha

                ORDER BY
                    l.nome_linhas ASC,
                    p.nome_pontos ASC,
                    h.passagem_horarios ASC;
            `;

            const [rows] =
                await db.query(sql);

            const linhas = [];

            rows.forEach((item) => {

                let linha = linhas.find(
                    (l) =>
                        l.linha ===
                        item.nome_linhas
                );

                if (!linha) {

                    linha = {

                        linha:
                            item.nome_linhas,

                        pontos: []

                    };

                    linhas.push(linha);

                }

                let ponto =
                    linha.pontos.find(
                        (p) =>
                            p.nome ===
                            item.nome_pontos
                    );

                if (!ponto) {

                    ponto = {

                        nome:
                            item.nome_pontos,

                        horarios: []

                    };

                    linha.pontos.push(
                        ponto
                    );

                }

                ponto.horarios.push(
                    item.passagem_horarios
                );

            });

            return response.status(200).json({

                sucesso: true,

                mensagem:
                    'Horários carregados com sucesso',

                dados: linhas

            });

        } catch (error) {

            console.log(error);

            return response.status(500).json({

                sucesso: false,

                mensagem:
                    `Erro ao listar horários: ${error.message}`,

                dados: null

            });

        }

    },

    async cadastrarHorarios(request, response) {

        try {

            const {
                id_ponto,
                passagem_horarios
            } = request.body;

            const sql = `
                INSERT INTO horarios
                    (
                        id_ponto,
                        passagem_horarios
                    )
                VALUES
                    (?, ?);
            `;

            const values = [

                id_ponto,
                passagem_horarios

            ];

            const [result] =
                await db.query(
                    sql,
                    values
                );

            return response.status(200).json({

                sucesso: true,

                mensagem:
                    'Horário cadastrado com sucesso',

                dados: {

                    id:
                        result.insertId,

                    id_ponto,

                    passagem_horarios

                }

            });

        } catch (error) {

            return response.status(500).json({

                sucesso: false,

                mensagem:
                    `Erro ao cadastrar horário: ${error.message}`,

                dados: null

            });

        }

    },

    async atualizarHorarios(request, response) {

        try {

            const {
                id_ponto,
                passagem_horarios
            } = request.body;

            const { id } =
                request.params;

            const sql = `
                UPDATE horarios
                SET
                    id_ponto = ?,
                    passagem_horarios = ?
                WHERE
                    id_horario = ?;
            `;

            const values = [

                id_ponto,
                passagem_horarios,
                id

            ];

            const [result] =
                await db.query(
                    sql,
                    values
                );

            if (
                result.affectedRows === 0
            ) {

                return response.status(404).json({

                    sucesso: false,

                    mensagem:
                        `Horário ${id} não encontrado`,

                    dados: null

                });

            }

            return response.status(200).json({

                sucesso: true,

                mensagem:
                    'Horário atualizado com sucesso',

                dados: {

                    id,
                    id_ponto,
                    passagem_horarios

                }

            });

        } catch (error) {

            return response.status(500).json({

                sucesso: false,

                mensagem:
                    `Erro ao atualizar horário: ${error.message}`,

                dados: null

            });

        }

    },

    async apagarHorarios(request, response) {

        try {

            const { id } =
                request.params;

            const sql = `
                DELETE FROM horarios
                WHERE id_horario = ?;
            `;

            const values = [id];

            const [result] =
                await db.query(
                    sql,
                    values
                );

            if (
                result.affectedRows === 0
            ) {

                return response.status(404).json({

                    sucesso: false,

                    mensagem:
                        `Horário ${id} não encontrado`,

                    dados: null

                });

            }

            return response.status(200).json({

                sucesso: true,

                mensagem:
                    'Horário removido com sucesso',

                dados: null

            });

        } catch (error) {

            return response.status(500).json({

                sucesso: false,

                mensagem:
                    `Erro ao remover horário: ${error.message}`,

                dados: null

            });

        }

    }

};