const db = require('../dataBase/connection');

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