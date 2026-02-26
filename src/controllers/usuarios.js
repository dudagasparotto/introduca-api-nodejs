const db = require('../dataBase/connection');

module.exports = {
    async listarUsuario(req, res) {

        try {
            const sql = `SELECT id_usuario, id_tipo_usuario, nome_usuario, email_usuario, senha_usuario, telefone_usuario
            FROM usuario;`;

            const [rows] =  await db.query(sql);


            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'listar usuário',
                    itens: rows.length,
                    dados: rows
                }
            ); 

        }catch (error) {
                return res.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao listar usuário',
                    dados: error.message
 }); 
                }           
    },

            async cadastrarUsuario(req, res) {

        try {
            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'Cadastrar usuário',
                    dados: null
                }
            ); 

        }catch (error) {
                return res.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao cadastrar usuário',
                    dados: null
 }); 
               } 
            }, 
            async atualizarUsuario(req, res) {

        try {
            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'atualizar usuário',
                    dados: null
                }
            ); 
        }catch (error) {
                return res.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao atualizar usuário',
                    dados: null
 }); 
               } 
            },   
            async apagarUsuario(req, res) {

        try {
            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'apagar Tipos de usuário',
                    dados: null
                }
            ); 
        }catch (error) {
                return res.status(500).json(
                    {
                    sucesso: false, 
                    mensagem: 'Erro ao apagar usuário',
                    dados: null
                    }); 
               }
            },  

            async login(require, response) { 
            try {
            const {email, senha} = require.query;
            const sql = `SELECT 
                   id_tipo_usuario, nome_usuario
                FROM 
                    usuarios
                WHERE 
                    email_usuario = ? AND senha_usuario = ?;` ;

            const values = [email, senha];

            const [rows] = await db.query(sql, values);
            const nItens = rows.length;

            if (nItens < 1){
            return response.status(403).json(
            {
                sucesso: false, 
                mensagem: 'login e/ou senha inválido.',
                itens: rows.length,
                dados: null,
            }); }

            const dados = rows.map(usuarios => ({
                id: usuarios.id_tipo_usuario,
                nome: usuarios.nome_usuario
            }));

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'login efetuado com sucesso.',
                dados
            }); 
            }
            catch (error) {
                return response.status(500).json(
                {
                    sucesso: false, 
                    mensagem: `Erro na requisição. ${error.message}`,
                    dados: error.message 
                }); 
            }           
}
}                      