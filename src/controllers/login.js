const db = require('../dataBase/connection');

module.exports = {
async login(require, response) {  

    try {
        const {email, senha} = require.query;
        const sql = `SELECT 
                   id_tipo_usuario, nome_usuario
                FROM 
                    usuarios
                WHERE 
                    email_usuario = ? AND senha_usuario = ? AND telefone_usuario = ? ;` ;

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
            }); 
        }
             return response.status(200).json(
            {
                sucesso: true, 
                mensagem: 'login efetuado com sucesso.',
                dados: rows,
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