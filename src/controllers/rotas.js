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
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Cadastro de rota realizado com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao cadastrar rota: ${error.message}`,
                dados: null
                }
            );
        }
    },
    async editarrotas (request, response) {
        try{
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Atualização de rota realizado com sucesso',
                dados: null
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