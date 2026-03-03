const { response } = require('express');
const db = require('../dataBase/connection');

module.exports = {
    async listarMotorista(req, res) {

        try {

            const sql = `SELECT id_motorista, cpf_motorista, cnh_motorista, foto_motorista
                         FROM motorista`;

            const [rows] =  await db.query(sql);
            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'listar motorista',
                    itens: rows.length,
                    dados: rows
                }
            ); 
        }catch (error) {
                return res.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao listar motorista',
                    dados: error.message
 }); 
                }           
    },

            async cadastrarMotorista(req, res) {

        try {
            const { cpf_motorista, cnh_motorista, foto_motorista } = req.body;
            const sql  = `INSERT INTO motorista (cpf_motorista, cnh_motorista, foto_motorista)
             VALUES (?,?,?);`; 

             //Definição dos dados a serem inseridos em uma array
             const values = [cpf_motorista, cnh_motorista, foto_motorista];

              //Execulsão da instrução sql passando os parametros 
               const [result] = await db.query (sql, values);

            
               // Definição do ID  do registro inserido
               const dados = {
                id: result.insertId,
                cpf_motorista,
                cnh_motorista,
                foto_motorista
               }
            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'Cadastro do motorista realizado com sucesso', 
                    dados: dados 
                }
            ); 
        }catch (error) {
                return res.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao cadastrar motorista  ${error.message}',
                    dados: error.message
 }); 
               } 
            }, 

            async atualizarMotorista(req, res) {

        try {
            // Parametros recebidos pelo corpo da requisição 
            const { cpf_motorista, cnh_motorista, foto_motorista } = req.body;

            //parametro recebido pela URL da requisição
            const {id} = req.params;

            // Instrução SQL para atualização do registro
            const sql = `UPDATE motorista SET 
                 cpf_motorista = ?, cnh_motorista = ?, foto_motorista = ? 
            WHERE 
                 id_motorista = ?;`;

                 // Preparo do array com dados a serem atualizados
                 const values = [cpf_motorista, cnh_motorista, foto_motorista, id];

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
                        cpf_motorista,
                        cnh_motorista,
                        foto_motorista

                    }
            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'usuario ${id} atualizado com sucesso',
                    dados
                }
            ); 
        }catch (error) {
                return res.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao atualizar motorista',
                    dados: error.message
 }); 
               } 
            },   
            async apagarMotorista(req, res) {

        try {
            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'apagar motorista',
                    itens: rows.length,
                    dados: rows
                }
            ); 
        }catch (error) {
                return res.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao apagar motorista',
                    dados: rows 
 }); 
               }
            }                           
    };