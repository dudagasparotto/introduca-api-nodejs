const db = require('../dataBase/connection');

function formatarHorario(horario) {
    return horario ? String(horario).slice(0, 5) : '';
}

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
                    r.id_rota,
                    l.id_linha,
                    l.nome_linhas
                FROM horarios h
                INNER JOIN pontos p
                    ON h.id_ponto = p.id_pontos
                LEFT JOIN rotas r
                    ON p.id_rota = r.id_rota
                LEFT JOIN linhas l
                    ON r.id_linha = l.id_linha
                ORDER BY
                    l.nome_linhas ASC,
                    p.nome_pontos ASC,
                    h.passagem_horarios ASC;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Horários carregados com sucesso',
                itens: rows.length,
                dados: rows
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar horários: ${error.message}`,
                dados: null
            });

        }

    },

    async listarHorariosDoPonto(request, response) {

        try {

            const { id } = request.params;

            const sql = `
                SELECT
                    h.id_horario,
                    h.id_ponto,
                    h.passagem_horarios
                FROM horarios h
                WHERE h.id_ponto = ?
                ORDER BY h.passagem_horarios ASC;
            `;

            const [rows] = await db.query(sql, [id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Horarios do ponto carregados com sucesso',
                itens: rows.length,
                dados: rows.map((horario) => ({
                    id_horario: horario.id_horario,
                    id_ponto: horario.id_ponto,
                    passagem_horarios: formatarHorario(horario.passagem_horarios),
                    hora: formatarHorario(horario.passagem_horarios)
                }))
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar horarios do ponto: ${error.message}`,
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

            const [result] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Horário cadastrado com sucesso',
                dados: {
                    id_horario: result.insertId,
                    id_ponto,
                    passagem_horarios
                }
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar horário: ${error.message}`,
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

            const { id } = request.params;

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

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Horário ${id} não encontrado`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Horário atualizado com sucesso',
                dados: {
                    id_horario: Number(id),
                    id_ponto,
                    passagem_horarios
                }
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar horário: ${error.message}`,
                dados: null
            });

        }

    },

    async apagarHorarios(request, response) {

        try {

            const { id } = request.params;

            const sql = `
                DELETE FROM horarios
                WHERE id_horario = ?;
            `;

            const values = [id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Horário ${id} não encontrado`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Horário removido com sucesso',
                dados: null
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao remover horário: ${error.message}`,
                dados: null
            });

        }

    }

};
