const db = require('../dataBase/connection');

module.exports = {
    async listarUsuario(req, res) {
        try {
            const sql = `SELECT id_usuario, id_tipo_usuario, nome_usuario, email_usuario, senha_usuario, telefone_usuario
            FROM usuarios;`;

            const [rows] =  await db.query(sql);

            return res.status(200).json({
                    sucesso: true, 
                    mensagem: 'listar usuário',
                    itens: rows.length,
                    dados: rows
                }); 
        }
            catch (error) {
                return res.status(500).json({
                    sucesso: false, 
                    mensagem: 'Erro ao listar usuário',
                    dados: error.message
                }); 
            }           
    },



    async cadastrarUsuario(req, res) {
        try {
            const {id_tipo_usuario, nome_usuario, email_usuario, senha_usuario, telefone_usuario} = req.body;

            //instrução sql 
            const sql = `INSERT INTO usuarios
            (id_tipo_usuario, nome_usuario, email_usuario, senha_usuario, telefone_usuario)
            VALUES 
                (?, ?, ?, ?, ?);` ; 

                //Definição dos dados a serem inseridos em uma array
                const values = [id_tipo_usuario, nome_usuario, email_usuario, senha_usuario, telefone_usuario];

                //Execulsão da instrução sql passando os parametros
                const [result] = await db.query(sql, values);

                //Definição do ID do registro inserido
                const dados = {
                    id: result.insertId,
                    id_tipo_usuario,
                    nome_usuario, 
                    email_usuario, 
                    senha_usuario,
                    telefone_usuario
                }; 

            return res.status(200).json({
                    sucesso: true, 
                    mensagem: 'Cadastrar usuário',
                    dados: dados
                }); 

        }
            catch (error) {
                return res.status(500).json({
                    sucesso: false, 
                    mensagem: 'Erro ao cadastrar usuário',
                    dados: error.message
                }); 
            } 
    }, 




    async atualizarUsuario(req, res) {

        try {
            // parametros recebidos pelo corpo da requisição
            const {id_tipo_usuario, nome_usuario, email_usuario, senha_usuario, telefone_usuario} = req.body;
           
            // parametros recebidos pelo URL via params =, ex: /usuario/1
            const {id} = req.params;
            
            //instrução sql
            const sql = `UPDATE usuarios
            SET id_tipo_usuario = ?, nome_usuario = ?, email_usuario = ?, senha_usuario = ?, telefone_usuario = ?
            WHERE id_usuario = ?;` ;

            //parametros do array com dados que serão atualizados
            const values = [id_tipo_usuario, nome_usuario, email_usuario, senha_usuario, telefone_usuario, id];

            //Execulsão e obtenção de confirmação da atualização realizada
            const [result] = await db.query(sql, values);

            
            if (result.affectedRows === 0) {
                return res.status(404).json({  
                    sucesso: false, 
                    mensagem: `Usuario ID ${id} não encontrado!`,
                    dados: null
                }); 
            }

            const dados = {
            id,
            id_tipo_usuario,
            nome_usuario,
            email_usuario,
            senha_usuario,
            telefone_usuario
            }; 

            return res.status(200).json({
                    sucesso: true,
                    mensagem: `Usuario ID ${id} atualizado com sucesso!`,
                    dados
            });
        }
            catch (error) {
                return res.status(500).json({
                    sucesso: false, 
                    mensagem: 'Erro ao atualizar usuário',
                    dados: error.message
                }); 
            } 
    },   


    async apagarUsuario(req, res) {
        try {
              //parametro passando via url na chamada da api pelo front-end 
            const { id } = req.params;

            //comando de exclusão
            const sql = `DELETE FROM
            usuarios WHERE
            id_usuario = ?;` ;

            //array com os parametros da exclusão
            const values = [id];

            // execulta instrução no banco de dados
            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: `Usuario ID ${id} não encontrado!`,
                    dados: null
                });
            }

            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'Usuario apagado com sucesso',
                    dados: null
                }
            ); 
        }
            catch (error) {
                return res.status(500).json(
                    {
                    sucesso: false, 
                    mensagem: 'Erro ao apagar usuário',
                    dados: error.message
                    }); 
            }
    },  

            async login(req, res) { 
            try {
            const {email, senha} = req.query;
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
            return res.status(403).json(
            {
                sucesso: false, 
                mensagem: 'login e/ou senha inválido.',
                itens: rows.length,
                dados: null,
            }); }

            const dados = rows.map(usuarios => ({  //Devolver dados com nome dos campos tratadoss
                id: usuarios.id_tipo_usuario,
                nome: usuarios.nome_usuario,
                tipo: nome_tipo_usuario
            }));

            return res.status(200).json({
                sucesso: true, 
                mensagem: 'login efetuado com sucesso.',
                dados
            }); 
            }
            catch (error) {
                return res.status(500).json(
                {
                    sucesso: false, 
                    mensagem: `Erro na requisição. ${error.message}`,
                    dados: error.message 
                }); 
            }           
}
}                      