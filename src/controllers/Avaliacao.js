const db = require('../dataBase/connection');

module.exports = {
async listarAvaliacao(require, response) {  //READ

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
                    mensagem: `Erro ao listar a avaliação; ${error.message}`,
                    dados: null 
                }
            ); 
        }           
},

    async cadastrarAvaliacao(require, response) { //CREATE

        try {

        const { id_usuario, id_motorista,  nota_avaliacao, comentario_avaliacao, data_avaliacao } = require.body; //captura dos dados enviados pelo cliente

        const sql = `INSERT INTO avaliacao 
                    (id_usuario, id_motorista, nota_avaliacao, comentario_avaliacao, data_avaliacao) 
                    VALUES (?, ?, ?, ?, ?);` ;    

            
            const values = [id_usuario, id_motorista, nota_avaliacao, comentario_avaliacao, data_avaliacao]; //definição dos dados a serem inseridos em uma array
            
            const [ result ] = await db.query(sql, values); //execução da instrução SQL passando os parâmetros

            const dados = {  //identificação do ID do registro inserido
                id: result.insertId,
                nota_avaliacao,
                comentario_avaliacao,
                data_avaliacao
            }
            
            return response.status(200).json(
                {   
                sucesso: true, 
                mensagem: 'Cadastro da avaliação realizado com sucesso',
                dados: dados
                }
            ); 
        }
    catch (error) {
            return response.status(500).json(
                {
                    sucesso: false, 
                    mensagem: `Erro ao cadastrar avaliação: ${error.message}`,
                    dados: error.message
                }
            ); 
        } 
    }, 
        async atualizarAvaliacao(require, response) {  //UPDATE
        try {
            //parâmetros recebidos pelo corpo da requisição
            const { id_avaliacao, id_usuario, id_motorista, nota_avaliacao, comentario_avaliacao, data_avaliacao } = require.body;
            
            //parâmetro recebido pela URL da requisição
            const {id} = require.params;

            //instruções SQL para atualização do registro
            const sql =    `UPDATE avaliacao
                            SET id_usuario = ?,
                                id_motorista = ?,
                                nota_avaliacao = ?,
                                comentario_avaliacao = ?,
                                data_avaliacao = ?
                            WHERE id_avaliacao = ?;` ;
         
            //definição dos dados a serem atualizados em uma array
            const values = [ id_usuario, id_motorista, nota_avaliacao, comentario_avaliacao, data_avaliacao, id_avaliacao ];

            //execução e confirmação da instrução SQL passando os parâmetros
            const [result] = await db.query(sql, values); 

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Avaliação ${id} não encontrada para atualização`,
                    dados: null
                });
            }
            const dados = {
                id: id_avaliacao,
                id_usuario,
                id_motorista,
                nota_avaliacao,
                comentario_avaliacao,
                data_avaliacao
            }

        return response.status(200).json(
            {
                sucesso: true, 
                mensagem: `avaliação ${id} atualizada com sucesso!`,
                dados 
            }); 
    }
    catch (error) {
            return response.status(500).json(
                {
                sucesso: false, 
                mensagem: `Erro ao atualizar a avaliação: ${error.message}`,
                dados: error.message  
                }
            ); 
          } 
        }, 

        async apagarAvaliacao(require, response) {  //DELET
            try {

            const {id} = require.params ;
            const sql = `DELETE FROM avaliacao WHERE id_avaliacao = ?;` ;
            const values = [id];
            const [result] = await db.query(sql, values); 
            
            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Avaliação ${id} não encontrada para exclusão`,
                    dados: null
                });
            }

            return response.status(200).json(
                {
                sucesso: true, 
                mensagem: `Avaliação ${id} apagada com sucesso`,
                dados: null
                }); 
            }

            catch (error) {
            return response.status(500).json(
                {
                sucesso: false, 
                mensagem: `Erro ao apagar a avaliação: ${error.message}`,
                dados: error.message
                }); 
            }
        }                           
};