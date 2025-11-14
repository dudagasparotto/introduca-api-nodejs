const db = require('../dataBase/connection');

module.exports = {
    async listarManutencao(require, response) {

        try {
            return response.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'lista de Manutencao obtida com sucesso',
                    dados: null
                }
            ); 
        }
        catch (error) {
                return response.status(500).json(
                    {
                        sucesso: false, 
                        mensagem: 'Erro ao listar a Manutencao: ${error.message}',
                        dados: null 
                    }
                ); 
            }           
    },

        async cadastrarManutencao(require, response) {

            try {
                return response.status(200).json(
                    {   
                    sucesso: true, 
                    mensagem: 'Cadastro da Manutencao realizado com sucesso',
                    dados: null
                    }
                ); 
            }
        catch (error) {
                return response.status(500).json(
                    {
                        sucesso: false, 
                        mensagem: 'Erro ao cadastrar Manutencao: ${error.message}',
                        dados: null 
                    }
                ); 
            } 
        }, 
            async atualizarManutencao(require, response) {

            try {
            return response.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'atualização da Manutencao realizado com sucesso',
                    dados: null
                }
            ); 
        }
        catch (error) {
                return response.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao atualizar a Manutencao: ${error.message}',
                    dados: null 
 }); 
               } 
            },   
            async apagarManutencao(require, response) {

            try {
            return response.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'Manutencao apagada com sucesso',
                    dados: null
                }
            ); 
        }
        catch (error) {
                return response.status(500).json(
                    {
                    sucesso: false, 
                    mensagem: 'Erro ao apagar a Manutencao: ${error.message}',
                    dados: null 
                    }
                ); 
               }
            }                           
    };