const db = require('../dataBase/connection');

async function buscarMotoristasDaRota(idRota) {
    const sql = `
        SELECT
            m.id_motorista,
            m.nome_motorista AS nome,
            m.foto_motorista AS foto,
            'Ativo' AS status,
            ROUND(AVG(a.nota_avaliacao), 1) AS media_avaliacao
        FROM motoristas_rotas mr
        INNER JOIN motorista m
            ON m.id_motorista = mr.id_motorista
        LEFT JOIN avaliacao a
            ON a.id_motorista = m.id_motorista
        WHERE mr.id_rota = ?
        GROUP BY
            m.id_motorista,
            m.nome_motorista,
            m.foto_motorista
        ORDER BY
            m.nome_motorista ASC;
    `;

    const [rows] = await db.query(sql, [idRota]);

    return rows.map((motorista) => ({
        id_motorista: motorista.id_motorista,
        nome: motorista.nome,
        foto: motorista.foto,
        status: motorista.status,
        media_avaliacao: motorista.media_avaliacao || 0
    }));
}

function formatarHorario(horario) {
    return horario ? String(horario).slice(0, 5) : '';
}

module.exports = {
    async listarrotas(request, response) {

        try {

            const sql = `
                SELECT
                    r.id_rota,
                    r.id_ponto,
                    r.id_linha,
                    r.mapa,
                    l.nome_linhas
                FROM rotas r
                INNER JOIN linhas l
                    ON r.id_linha = l.id_linha;
            `;

            const [rotas] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista da rota obtida com sucesso',
                itens: rotas.length,
                dados: rotas
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar a rota: ${error.message}`,
                dados: null
            });

        }

    },

    async listarRotasComPontos(request, response) {

        try {

            const sql = `
                SELECT
                    l.id_linha,
                    l.nome_linhas,
                    p.id_pontos,
                    p.nome_pontos
                FROM rotas r

                INNER JOIN linhas l
                    ON r.id_linha = l.id_linha

                INNER JOIN pontos p
                    ON r.id_ponto = p.id_pontos

                ORDER BY
                    l.nome_linhas ASC,
                    p.nome_pontos ASC
            `;

            const [rows] = await db.query(sql);

            const linhasMap = {};

            rows.forEach((item) => {

                if (!linhasMap[item.id_linha]) {

                    linhasMap[item.id_linha] = {
                        id: item.id_linha,
                        linha: item.nome_linhas,
                        pontos: []
                    };

                }

                linhasMap[item.id_linha].pontos.push({
                    id: item.id_pontos,
                    nome: item.nome_pontos,
                    horarios: []
                });

            });

            const dados = Object.values(linhasMap);

            return response.status(200).json({
                sucesso: true,
                dados
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: error.message
            });

        }

    },

    async listarMotoristasDaRota(request, response) {

        try {

            const { id } = request.params;
            const motoristas = await buscarMotoristasDaRota(id);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Motoristas da rota carregados com sucesso',
                itens: motoristas.length,
                dados: motoristas
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar motoristas da rota: ${error.message}`,
                dados: []
            });

        }

    },

    async buscarDetalhesDaRota(request, response) {

        try {

            const { id } = request.params;

            const rotaSql = `
                SELECT
                    r.id_rota,
                    r.id_linha,
                    l.nome_linhas AS nome_rota
                FROM rotas r
                INNER JOIN linhas l
                    ON l.id_linha = r.id_linha
                WHERE r.id_rota = ?;
            `;

            const [rotas] = await db.query(rotaSql, [id]);

            if (rotas.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Rota nao encontrada',
                    dados: null
                });
            }

            const pontosSql = `
                SELECT
                    id_pontos,
                    nome_pontos,
                    latitude_pontos,
                    longitude_pontos
                FROM pontos
                WHERE id_rota = ?
                ORDER BY id_pontos ASC;
            `;

            const horariosSql = `
                SELECT
                    h.id_horario,
                    h.id_ponto,
                    h.passagem_horarios,
                    p.nome_pontos
                FROM horarios h
                INNER JOIN pontos p
                    ON p.id_pontos = h.id_ponto
                WHERE p.id_rota = ?
                ORDER BY
                    p.nome_pontos ASC,
                    h.passagem_horarios ASC;
            `;

            const [pontos] = await db.query(pontosSql, [id]);
            const [horarios] = await db.query(horariosSql, [id]);
            const motoristas = await buscarMotoristasDaRota(id);
            const rota = rotas[0];

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Rota carregada com sucesso',
                dados: {
                    id_rota: rota.id_rota,
                    id_linha: rota.id_linha,
                    nome_rota: rota.nome_rota,
                    pontos: pontos.map((ponto) => ({
                        id_ponto: ponto.id_pontos,
                        nome_ponto: ponto.nome_pontos,
                        latitude: ponto.latitude_pontos,
                        longitude: ponto.longitude_pontos
                    })),
                    horarios: horarios.map((horario) => ({
                        id_horario: horario.id_horario,
                        id_ponto: horario.id_ponto,
                        nome_ponto: horario.nome_pontos,
                        hora: formatarHorario(horario.passagem_horarios)
                    })),
                    motoristas
                }
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao buscar detalhes da rota: ${error.message}`,
                dados: null
            });

        }

    },

    async cadastrarrotas (request, response) {
        try{
            const { id_do_Ponto, id_da_Linha } = request.body;

            const sql = `
                INSERT INTO rotas 
                    (id_ponto, id_linha) 
                VALUES
                    (?, ?);
            `;

            const values = [id_do_Ponto, id_da_Linha];

            const [result] = await db.query(sql, values);

            const dados = {
                id: result.insertId,
                id_do_Ponto, 
                id_da_Linha
            };

            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Cadastro de rota realizado com sucesso',
                dados: dados
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao cadastrar rota: ${error.message}`,
                dados: error.message
                }
            );
        }
    },
    async editarrotas (request, response) {
        try{
            const { id_do_Ponto, id_da_Linha } = request.body;
            
            const { id } = request.params;
            
            const sql = `
                UPDATE rotas SET
                    id_ponto = ?, id_linha = ?
                WHERE
                    id_rota = ?;
            `;

            const values = [ id_do_Ponto, id_da_Linha, id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Linha ${id} não encontrado!`,
                    dados: null
                });
            }
            
            const dados = {
                id, 
                id_do_Ponto, 
                id_da_Linha
            };
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: `Atualização de rota ${id} realizado com sucesso`,
                dados
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao atualizar a rota: ${error.message}`,
                dados: null
                }
            );
        }
    },
    async apagarrotas (request, response) {
        try{
            const {id} = request.params;
            
            const sql = `DELETE FROM rotas WHERE id_rota = ?`;
            
            const values = [id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Rota ${id} não encontrada!`,
                    dados: null
                });
            }

            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Exclusão de rota realizada com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao remover rota: ${error.message}`,
                dados: null
                }
            );
        }
    },
};
