const db = require('../dataBase/connection');

module.exports = {

    async listarUsuario(req, res) {

        try {

            const sql = `
                SELECT 
                    id_usuario,
                    id_tipo_usuario,
                    nome_usuario,
                    senha_usuario
                FROM usuarios;
            `;

            const [rows] = await db.query(sql);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Listar usuários',
                itens: rows.length,
                dados: rows
            });

        } catch (error) {

            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao listar usuários',
                dados: error.message
            });

        }

    },

    async cadastrarUsuario(req, res) {

        try {

            const {
                id_tipo_usuario,
                nome_usuario,
                senha_usuario
            } = req.body;

            const sql = `
                INSERT INTO usuarios
                (
                    id_tipo_usuario,
                    nome_usuario,
                    senha_usuario
                )
                VALUES (?, ?, ?);
            `;

            const values = [
                id_tipo_usuario,
                nome_usuario,
                senha_usuario
            ];

            const [result] = await db.query(sql, values);

            const dados = {
                id_usuario: result.insertId,
                id_tipo_usuario,
                nome_usuario,
                senha_usuario
            };

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Usuário cadastrado com sucesso',
                dados
            });

        } catch (error) {

            return res.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar usuário: ${error.message}`,
                dados: error.message
            });

        }

    },

    async atualizarUsuario(req, res) {

        try {

            const {
                id_tipo_usuario,
                nome_usuario,
                senha_usuario
            } = req.body;

            const { id } = req.params;

            const sql = `
                UPDATE usuarios
                SET
                    id_tipo_usuario = ?,
                    nome_usuario = ?,
                    senha_usuario = ?
                WHERE id_usuario = ?;
            `;

            const values = [
                id_tipo_usuario,
                nome_usuario,
                senha_usuario,
                id
            ];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    sucesso: false,
                    mensagem: `Usuário ID ${id} não encontrado!`,
                    dados: null
                });

            }

            const dados = {
                id,
                id_tipo_usuario,
                nome_usuario,
                senha_usuario
            };

            return res.status(200).json({
                sucesso: true,
                mensagem: `Usuário ID ${id} atualizado com sucesso!`,
                dados
            });

        } catch (error) {

            return res.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar usuário: ${error.message}`,
                dados: error.message
            });

        }

    },

    async apagarUsuario(req, res) {

        try {

            const { id } = req.params;

            const sql = `
                DELETE FROM usuarios
                WHERE id_usuario = ?;
            `;

            const values = [id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    sucesso: false,
                    mensagem: `Usuário ID ${id} não encontrado!`,
                    dados: null
                });

            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Usuário apagado com sucesso',
                dados: null
            });

        } catch (error) {

            return res.status(500).json({
                sucesso: false,
                mensagem: `Erro ao apagar usuário: ${error.message}`,
                dados: error.message
            });

        }

    },

    async login(req, res) {

        try {

            const { email, senha } = req.query;

            const sql = `
                SELECT
                    id_usuario,
                    id_tipo_usuario,
                    nome_usuario
                FROM usuarios
                WHERE
                    nome_usuario = ?
                AND
                    senha_usuario = ?;
            `;

            const values = [email, senha];

            const [rows] = await db.query(sql, values);

            if (rows.length < 1) {

                return res.status(403).json({
                    sucesso: false,
                    mensagem: 'Login e/ou senha inválidos.',
                    dados: null
                });

            }

            const dados = rows.map(usuario => ({
                id_usuario: usuario.id_usuario,
                id_tipo_usuario: usuario.id_tipo_usuario,
                nome_usuario: usuario.nome_usuario
            }));

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Login efetuado com sucesso.',
                dados
            });

        } catch (error) {

            return res.status(500).json({
                sucesso: false,
                mensagem: `Erro na requisição: ${error.message}`,
                dados: error.message
            });

        }

    }

};