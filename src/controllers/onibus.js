const db = require('../dataBase/connection');

module.exports = {
    async listaronibus (request, response) {
        try{
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Lista do onibus obtida com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao listar o onibus: ${error.message}`,
                dados: null
                }
            );
        }
    },
    async cadastraronibus (request, response) {
        try{
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Cadastro de onibus realizado com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao cadastrar onibus: ${error.message}`,
                dados: null
                }
            );
        }
    },
    async editaronibus (request, response) {
        try{
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Atualização de onibus realizado com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao atualizar o onibus: ${error.message}`,
                dados: null
                }
            );
        }
    },
    async apagaronibus (request, response) {
        try{
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Exclusão de onibus realizada com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao remover onibus: ${error.message}`,
                dados: null
                }
            );
        }
    },
};