const { response, request } = require('express');
const db = require('../dataBase/connection');

module.exports = {
    async listarMotorista(request, response) {
        try {
            const { nome } = request.query;

            const id_motorista = nome ? `%${nome}%` : `%`;
            const sql = `
                SELECT 
                    id_motorista,nome_motorista, cpf_motorista, cnh_motorista, foto_motorista
                FROM 
                    motorista
                ORDER BY
                    id_motorista like ?;
            `;

            const values = [id_motorista];

            const [rows] = await db.query(sql, values);
            const nItens = rows.length;

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'listar motorista',
                nItens,
                dados: rows
            });

        } catch (error) {
            return response.status(500).json({
            sucesso: false, 
            mensagem: 'Erro ao listar motorista.',
            dados: error.message
            });
        }           
    },

    async cadastrarMotorista(request, response) {
        try {
            const { nome_motorista, cpf_motorista, cnh_motorista, foto_motorista } = request.body;

            //instrução sql
            const sql  = `INSERT INTO motorista (nome_motorista, cpf_motorista, cnh_motorista, foto_motorista)
             VALUES (?,?,?,?);`; 

            //Definição dos dados a serem inseridos em uma array
            const values = [nome_motorista, cpf_motorista, cnh_motorista, foto_motorista];

            //Execulsão da instrução sql passando os parametros 
            const [result] = await db.query (sql, values);

            
            // Definição do ID  do registro inserido
            const dados = {
                id: result.insertId,
                nome_motorista,
                cpf_motorista,
                cnh_motorista,
                foto_motorista
            }
            return response.status(200).json({
                sucesso: true, 
                mensagem: 'Cadastro do motorista realizado com sucesso', 
                dados: dados 
            }); 
        }

        catch (error) {
            return response.status(500).json({
                sucesso: false, 
                mensagem: 'Erro ao cadastrar motorista  ${error.message}',
                dados: error.message
            }); 
        } 
    }, 

    async atualizarMotorista(request, response) {
        try {
            // Parametros recebidos pelo corpo da requisição 
            const { nome_motorista, cpf_motorista, cnh_motorista, foto_motorista } = request.body;

            //parametro recebido pela URL da requisição
            const {id} = request.params;

            // Instrução SQL para atualização do registro
            const sql =`
                UPDATE 
                    motorista 
                SET 
                   nome_motorista=?, cpf_motorista = ?, cnh_motorista = ?, foto_motorista = ? 
                WHERE 
                    id_motorista = ?;
            `;

            // Preparo do array com dados a serem atualizados
            const values = [nome_motorista, cpf_motorista, cnh_motorista, foto_motorista, id];

            //Execulsão da instrução sql passando os parametros
            const  [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            return response.status(404).json({
                sucesso: false,
                mensagem: `Motorista ID ${id} não encontrado!`,
                dados: null
            });
        }   

            const dados = {
            id,
            nome_motorista,
            cpf_motorista,
            cnh_motorista,
            foto_motorista
            };

        return response.status(200).json({
            sucesso: true, 
            mensagem: 'usuario ${id} atualizado com sucesso',
            dados
        }); 

        }
    
        catch (error) {
            return response.status(500).json({
                sucesso: false, 
                mensagem: 'Erro ao atualizar motorista',
                dados: error.message
            }); 
        } 
    },   
            
    async apagarMotorista(request, response) {
        try { 

            //parametro passando via url na chamada da api pelo front-end 
            const { id } = request.params; 
            
            //comando de exclusão
            const sql =`
            DELETE FROM 
                motorista 
            WHERE
               id_motorista = ?;
            `;

            //array com os parametros da exclusão 
            const values = [id]; 

            // execulta instrução no banco de dados 
            const [result] = await db.query (sql, values); 

        if (result.affectedRows === 0){
            return response.status (404).json({
                sucesso: false, 
                mensagem: `Usuário ${id} não encontrado!`, 
                dados: null
            }); 
        }

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'motorista apagado com sucesso',
                dados: null
            }); 

        }
        
        catch (error) {
            return response.status(500).json({
                sucesso: false, 
                mensagem: 'Erro ao apagar motorista',
                dados: error.message
            });

        }
    }                           
};