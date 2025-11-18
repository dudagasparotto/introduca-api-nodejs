const db = require('../dataBase/connection');

module.exports = {
    async listarAvaliacao(require, response) {

        try {

        const sql = `SELECT 
                        id_avaliacao, id_usuario, id_motorista, nota_avaliacao, comentario_avaliacao, data_avaliacao
                    FROM avaliacao;` ;

            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'lista de avaliação obtida com sucesso',
                    itens: rows.length,
                    dados: rows
                }
            ); 
        }
        catch (error) {
                return response.status(500).json(
                    {
                        sucesso: false, 
                        mensagem: 'Erro ao listar a avaliação; ${error.message}',
                        dados: null 
                    }
                ); 
            }           
    },

        async cadastrarAvaliacao(require, response) {

            try {
                return response.status(200).json(
                    {   
                    sucesso: true, 
                    mensagem: 'Cadastro avaliação realizado com sucesso',
                    dados: null
                    }
                ); 
            }
        catch (error) {
                return response.status(500).json(
                    {
                        sucesso: false, 
                        mensagem: 'Erro ao cadastrar avaliação: ${error.message}',
                        dados: null 
                    }
                ); 
            } 
        }, 
            async atualizarAvaliacao(require, response) {

            try {
            return response.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'atualização da avaliação realizado com sucesso',
                    dados: null
                }
            ); 
        }
        catch (error) {
                return response.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao atualizar a avaliação: ${error.message}',
                    dados: null 
 }); 
               } 
            },   
            async apagarAvaliacao(require, response) {

            try {
            return response.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'Avaliação apagada com sucesso',
                    dados: null
                }
            ); 
        }
        catch (error) {
                return response.status(500).json(
                    {
                    sucesso: false, 
                    mensagem: 'Erro ao apagar a avaliação: ${error.message}',
                    dados: null 
                    }
                ); 
               }
            }                           
    };