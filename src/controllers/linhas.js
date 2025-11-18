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
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Cadastro da linha de ônibus realizado com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao cadastrar linha de ônibus: ${error.message}`,
                dados: null
                }
            );
        }
    },
    async editarlinhas (request, response) {
        try{
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Atualização de linha de ônibus realizado com sucesso',
                dados: null
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