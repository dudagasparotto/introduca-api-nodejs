const db = require('../dataBase/connection');

module.exports = {
async login(req, res) {  

    try {
        const { email, senha } = req.query;
        const sql = `SELECT 
                   id_tipo_usuario, nome_usuario
                FROM 
                    usuario
                WHERE 
                    email_usuario = ? AND senha_usuario = ?;`;

        const values = [email, senha];

        const [rows] = await db.query(sql, values);
        const nItens = rows.length;

        if (nItens < 1) {
            return res.status(403).json(
            {
                sucesso: false,
                mensagem: 'login e/ou senha inválido.',
                itens: rows.length,
                dados: null
            });
        }
        return res.status(200).json(
        {
            sucesso: true,
            mensagem: 'login efetuado com sucesso.',
            dados: rows
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