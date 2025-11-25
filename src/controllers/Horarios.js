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

            const {id_ponto, passagem_horarios} = require.body; //captura dos dados enviados pelo cliente
            
            //instrução SQL para inserção dos dados
            const sql = `INSERT INTO   
            horarios (id_ponto, passagem_horarios) 
            VALUES
            (?,?); `;

            const values = [id_ponto, passagem_horarios]; //definição dos dados a serem inseridos em uma array

            const [result] = await db.query(sql, values); //execução da instrução SQL passando os parâmetros

            const dados = {
                id_ponto,
                passagem_horarios
            }

                return response.status(200).json(
                    {   
                    sucesso: true, 
                    mensagem: 'Cadastro de Horarios realizado com sucesso',
                    dados: dados
                    }
                ); 
            }
        catch (error) {
                return response.status(500).json(
                    {
                        sucesso: false, 
                        mensagem: 'Erro ao cadastrar Horarios: ${error.message}',
                        dados: error.message 
                    }
                ); 
            } 
        }, 
            async atualizarHorarios(require, response) { //UPDATE
                try {

                const { id_ponto, passagem_horarios } = require.body; //captura dos dados enviados pelo cliente
                const {id} = require.params;
                const sql = `UPDATE horarios SET
                            id_ponto = ?, passagem_horarios = ? 
                            WHERE id_horario = ?; `;
                const values = [ id_ponto, passagem_horarios, id ]; //definição dos dados a serem atualizados em uma array
                const [result] = await db.query(sql, values); //execução da instrução SQL passando os parâmetros

                if (result.affectedRows === 0) {
                    return response.status(404).json({
                        sucesso: false, 
                        mensagem: `Horario com ID ${id} não encontrado.`,
                        dados: null
                    });
                }

                const dados = {
                    id_horario: id,
                    id_ponto,
                    passagem_horarios
                };

                return response.status(200).json(
                    {
                    sucesso: true, 
                    mensagem: `Horarios ${id} atualizados com sucesso`,
                    dados: dados
                    }); 
                }
                catch (error) {
                return response.status(500).json(
                    {
                    sucesso: false, 
                    mensagem: `Erro ao atualizar Horario: ${error.message}`,
                    dados: error.message 
                    }); 
               } 
            },   

            async apagarHorarios(require, response) { //DELETE
            try {
            return response.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'Horario apagado com sucesso',
                    dados: null
                }); 
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