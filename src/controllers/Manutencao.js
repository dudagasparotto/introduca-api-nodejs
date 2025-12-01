const db = require('../dataBase/connection');

module.exports = {
    async listarManutencao(require, response) {

        try {

            const sql = `SELECT 
                            id_manutencao, id_onibus, descricao_manutencao, data_inicio_manutencao, data_fim_manutencao, status_manutencao
                        FROM manutencao;`;

            const [rows] = await db.query(sql);

            return response.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'lista de Manutencao obtida com sucesso',
                    itens: rows.length,
                    dados: rows
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

                const { id_onibus, descricao_manutencao, data_inicio_manutencao, data_fim_manutencao, status_manutencao } = require.body; //captura dos dados enviados pelo cliente

                const sql = `INSERT INTO manutencao (id_onibus, descricao_manutencao, data_inicio_manutencao, data_fim_manutencao, status_manutencao)
                            VALUES
                            (?,?,?,?,?);`;

                const values = [ id_onibus, descricao_manutencao, data_inicio_manutencao, data_fim_manutencao, status_manutencao ]; //definição dos dados a serem inseridos em uma array

                const [result] = await db.query(sql, values); //execução da instrução SQL passando os parâmetros

                const dados = {
                    id: result.insertId,
                    id_onibus,
                    descricao_manutencao,
                    data_inicio_manutencao,
                    data_fim_manutencao,
                    status_manutencao
                }

                return response.status(200).json(
                    {   
                    sucesso: true, 
                    mensagem: 'Cadastro da Manutencao realizado com sucesso',
                    dados: dados
                    }
                ); 
            }
        catch (error) {
                return response.status(500).json(
                    {
                        sucesso: false, 
                        mensagem: 'Erro ao cadastrar Manutencao: ${error.message}',
                        dados: error.message 
                    }
                ); 
            } 
        }, 
            async atualizarManutencao(require, response) { //UPDATE
            try {

            const { id_manutencao, id_onibus, descricao_manutencao, data_inicio_manutencao, data_fim_manutencao, status_manutencao } = require.body; //captura dos dados enviados pelo cliente
            const {id} = require.params;
            const sql = `UPDATE manutencao SET 
                        id_onibus = ?, descricao_manutencao = ?, data_inicio_manutencao = ?, data_fim_manutencao = ?, status_manutencao = ?
                        WHERE id_manutencao = ?;`;
            const values = [ id_onibus, descricao_manutencao, data_inicio_manutencao, data_fim_manutencao, status_manutencao, id ]; //definição dos dados a serem atualizados em uma array
            const [result] = await db.query(sql, values); //execução da instrução SQL passando os parâmetros

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false, 
                        mensagem: `Manutencao ${id} não encontrada`,
                    dados: null 
                    });
                }
                const dados = {
                    id_manutencao,
                    id_onibus,
                    descricao_manutencao,
                    data_inicio_manutencao,
                    data_fim_manutencao,
                    status_manutencao
                };

                return response.status(200).json(
                    {
                    sucesso: true, 
                    mensagem: `Manutencao ${id} atualizada com sucesso`,
                    dados: dados
                    }); 
                }
             
                catch (error) {
                return response.status(500).json(
                    {
                    sucesso: false, 
                    mensagem: `Erro ao atualizar a Manutencao: ${error.message}`,
                    dados: error.mensagem 
                    }); 
               } 
            },   
            async apagarManutencao(require, response) { //DELETE
            try {
            const {id} = require.params;
            const sql = `DELETE FROM manutencao WHERE id_manutencao = ?;`;
            const values = [id];
            const [result] = await db.query(sql, values);
            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Manutencao ${id} não encontrada para exclusão`,
                    dados: null
                });
            }
            return response.status(200).json(
                {
                    sucesso: true, 
                    mensagem: `Manutencao ${id} apagada com sucesso`,
                    dados: null
                }
            ); 
        }
        catch (error) {
                return response.status(500).json(
                    {
                    sucesso: false, 
                    mensagem: `Erro ao apagar a Manutencao: ${error.message}`,
                    dados: error.message
                    }
                ); 
               }
            }                           
    };