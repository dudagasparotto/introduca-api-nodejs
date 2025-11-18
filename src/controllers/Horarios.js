const db = require('../dataBase/connection');

module.exports = {
    async listarHorarios(require, response) {

        try {

            const sql= `SELECT 
                            id_horario, id_ponto, passagem_horarios
                        FROM horarios; `;
            
            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'lista de Horarios obtida com sucesso',
                    itens: rows.length,
                    dados: rows
                }
            ); 
        }
        catch (error) {
                return response.status(500).json(
                    {
                        sucesso: false, 
                        mensagem: 'Erro ao listar os Horarios ${error.message}',
                        dados: null 
                    }
                ); 
            }           
    },

        async cadastrarHorarios(require, response) {

            try {
                return response.status(200).json(
                    {   
                    sucesso: true, 
                    mensagem: 'Cadastro de Horarios realizado com sucesso',
                    dados: null
                    }
                ); 
            }
        catch (error) {
                return response.status(500).json(
                    {
                        sucesso: false, 
                        mensagem: 'Erro ao cadastrar Horarios: ${error.message}',
                        dados: null 
                    }
                ); 
            } 
        }, 
            async atualizarHorarios(require, response) {

            try {
            return response.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'atualização dos Horarios realizado com sucesso',
                    dados: null
                }
            ); 
        }
        catch (error) {
                return response.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao atualizar Horario: ${error.message}',
                    dados: null 
 }); 
               } 
            },   
            async apagarHorarios(require, response) {

            try {
            return response.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'Horario apagado com sucesso',
                    dados: null
                }
            ); 
        }
        catch (error) {
                return response.status(500).json(
                    {
                    sucesso: false, 
                    mensagem: 'Erro ao apagar o Horario: ${error.message}',
                    dados: null 
                    }
                ); 
               }
            }                           
    };