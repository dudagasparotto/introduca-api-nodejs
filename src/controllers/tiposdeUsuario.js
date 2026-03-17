const e = require('cors');
const db = require('../dataBase/connection');

module.exports = {
    async listarTiposdeUsuario(req, res) {

        try {
            const {nome} = req.query;
            const id_tipo_usuario = nome ? `%${nome}%` : `%`;

            const sql = `
                SELECT
                    id_tipo_usuario, nome_tipo_usuario 
                FROM
                    tipo_usuarios
                WHERE 
                    id_tipo_usuario like ?;
                `;
                
            const values = [id_tipo_usuario];

            const [rows] =  await db.query(sql,values);
            const nItens = rows.length;
            
            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'listar Tipos de usuário',
                    nItens,
                    dados: rows
                }
            ); 
        }catch (error) {
                return res.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao listar tipos de usuário',
                    dados: error.message
 }); 
                }           
    },

            async cadastrarTiposdeUsuario(req, res) {

        try {
            const {nome_tipo_usuario} = req.body;   

            const sql  = `INSERT INTO tipo_usuarios (nome_tipo_usuario)
             VALUES (?);`;

             const values = [nome_tipo_usuario];   
             const [result] = await db.query (sql, values);

                const dados = {
                    id: result.insertId,
                    nome_tipo_usuario
                }

            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'Tipo de usuário cadastrado com sucesso',
                    dados: dados
                }
            ); 
        }catch (error) {
                return res.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao cadastrar tipos de usuário',
                    dados: error.message 
 }); 
               } 
            }, 
            async atualizarTiposdeUsuario(req, res) {

        try {
            const {id} = req.params;
            const {nome_tipo_usuario} = req.body;

                const sql = `UPDATE tipo_usuarios
                SET nome_tipo_usuario = ?
                WHERE id_tipo_usuario = ?;` ;

                const values = [nome_tipo_usuario, id];

                const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Tipo de usuário não encontrado',
                dados: null
            }); 
        }
        const dados = {
            id: id,
            nome_tipo_usuario
        }; 

        
            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'Tipos de usuário atualizado com sucesso',
                    dados
                }
            ); 
        }catch (error) {
                return res.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao atualizar tipos de usuário',
                    dados: error.message
 }); 
               } 
            },   
            async apagarTiposdeUsuario(req, res) {

        try {
            const {id} = req.params;

            const sql = `DELETE FROM tipo_usuarios
            WHERE id_tipo_usuario = ?;` ;

            const values = [id];
            const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Tipo de usuário não encontrado',
                dados: null
            }); 
        }
            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'Tipo de usuário apagado com sucesso',
                    dados: null
                }
            ); 
        }catch (error) {
                return res.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao apagar tipos de usuário',
                    dados: error.message
 }); 
               }
            }                           
    };