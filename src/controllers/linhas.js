const db = require('../dataBase/connection');

module.exports = {
    async listarlinhas (request, response) {
        try{

            const sql = `
                SELECT id_linha, nome_linhas, descricao_linha
                FROM linhas;
            `;

            const [linhas] = await db.query(sql);

            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Lista da linha de ônibus obtida com sucesso',
                itens: linhas.length,
                dados: linhas
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao listar a linha de ônibus: ${error.message}`,
                dados: null
                }
            );
        }
    },
    async cadastrarlinhas (request, response) {
        try{

            const { nome_da_linha, descricao_da_linha } = request.body;

            const sql = `
                INSERT INTO linhas 
                    (nome_linhas, descricao_linha) 
                VALUES
                    (?, ?);
            `;

            const values = [nome_da_linha, descricao_da_linha];

            const [result] = await db.query(sql, values);

            const dados = {
                id: result.insertId,
                nome_da_linha,
                descricao_da_linha
            };

            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Cadastro da linha de ônibus realizado com sucesso',
                dados: dados
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao cadastrar linha de ônibus: ${error.message}`,
                dados: error.message
                }
            );
        }
    },
    async editarlinhas (request, response) {
        try{
            const { nome_da_linha, descricao_da_linha } = request.body;
            
            const { id } = request.params;
            
            const sql = `
                UPDATE linhas SET
                    nome_linhas = ?, descricao_linha = ?
                WHERE
                    id_linha = ?;
            `;

            const values = [nome_da_linha, descricao_da_linha, id];

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
                nome_da_linha,
                descricao_da_linha
            };

            return response.status(200).json(
                {
                sucesso: true,
                mensagem: `Linha ${id} atualizada com sucesso!`,
                dados
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao atualizar a linha de ônibus: ${error.message}`,
                dados: null
                }
            );
        }
    },
    async apagarlinhas (request, response) {
        try{
            const {id} = request.params;
            
            const sql = `DELETE FROM linhas WHERE id_linha = ?`;
            
            const values = [id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Linha ${id} não encontrado!`,
                    dados: null
                });
            }

            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Exclusão da linha de ônibus realizada com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao remover a linha de ônibus: ${error.message}`,
                dados: null
                }
            );
        }
    },
};