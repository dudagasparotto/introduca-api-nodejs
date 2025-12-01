const db = require('../dataBase/connection');

module.exports = {
    async listarrotas (request, response) {
        try{

            const sql = `
                SELECT id_rota, id_ponto, id_linha, ordem_sequencia_rotas
                FROM rotas;
            `;

            const [rotas] = await db.query(sql);

            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Lista da rota obtida com sucesso',
                itens: rotas.length,
                dados: rotas
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao listar a rota: ${error.message}`,
                dados: null
                }
            );
        }
    },
    async cadastrarrotas (request, response) {
        try{
            const { id_do_Ponto, id_da_Linha, ordem_sequencia } = request.body;

            const sql = `
                INSERT INTO rotas 
                    (id_ponto, id_linha, ordem_sequencia_rotas) 
                VALUES
                    (?, ?, ?);
            `;

            const values = [id_do_Ponto, id_da_Linha, ordem_sequencia];

            const [result] = await db.query(sql, values);

            const dados = {
                id: result.insertId,
                id_do_Ponto, 
                id_da_Linha, 
                ordem_sequencia
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
            const { id_do_Ponto, id_da_Linha, ordem_sequencia } = request.body;
            
            const { id } = request.params;
            
            const sql = `
                UPDATE rotas SET
                    id_ponto = ?, id_linha = ?, ordem_sequencia_rotas = ?
                WHERE
                    id_rota = ?;
            `;

            const values = [ id_do_Ponto, id_da_Linha, ordem_sequencia, id];

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
                id_da_Linha, 
                ordem_sequencia
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