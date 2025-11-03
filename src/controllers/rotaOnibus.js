const db = require('../dataBase/connection');

module.exports = {
    async listarrotaOnibus (request, response) {
        try{
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Lista da rota do ônibus obtida com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao listar a rota de ônibus: ${error.message}`,
                dados: null
                }
            );
        }
    },
    async cadastrarrotaOnibus (request, response) {
        try{
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Cadastro de rota de ônibus realizado com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao cadastrar rota de ônibus: ${error.message}`,
                dados: null
                }
            );
        }
    },
    async editarrotaOnibus (request, response) {
        try{
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Atualização de rota de ônibus realizado com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao atualizar a rota de ônibus: ${error.message}`,
                dados: null
                }
            );
        }
    },
    async apagarrotaOnibus (request, response) {
        try{
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Exclusão de rota de ônibus realizada com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao remover rota de ônibus: ${error.message}`,
                dados: null
                }
            );
        }
    },
};