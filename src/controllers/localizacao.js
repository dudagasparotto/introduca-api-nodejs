const db = require('../dataBase/connection');

module.exports = {
    async listarlocalizacao (request, response) {
        try{
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Lista de localizacao obtida com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao listar a localizacao: ${error.message}`,
                dados: null
                }
            );
        }
    },
    async cadastrarlocalizacao (request, response) {
        try{
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Cadastro de localizacao realizado com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao cadastrar localizacao: ${error.message}`,
                dados: null
                }
            );
        }
    },
    async editarlocalizacao (request, response) {
        try{
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Atualização de localizacao realizado com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao atualizar a localizacao: ${error.message}`,
                dados: null
                }
            );
        }
    },
    async apagarlocalizacao (request, response) {
        try{
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Exclusão de localizacao realizada com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao remover localizacao: ${error.message}`,
                dados: null
                }
            );
        }
    },
};