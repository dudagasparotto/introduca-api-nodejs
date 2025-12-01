const db = require('../dataBase/connection');

module.exports = {
    async listarpontos (request, response) {
        try{

            const sql = `
                SELECT 
                    id_pontos, nome_pontos, latitude_pontos, longitude_pontos
                FROM pontos;
            `;

            const [pontos] = await db.query(sql);

            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Lista dos pontos obtida com sucesso',
                dados: pontos
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao listar os pontos: ${error.message}`,
                dados: error.message
                }
            );
        }
    },
    async cadastrarpontos (request, response) {
        try{

            const {nome_dos_pontos, latitude_dos_pontos, longitude_dos_pontos} = request.body;

            const sql = `
                INSERT INTO pontos 
                    (nome_pontos, latitude_pontos, longitude_pontos) 
                VALUES
                    (?, ?, ?);
            `;

            const values = [nome_dos_pontos, latitude_dos_pontos, longitude_dos_pontos];

            const [result] = await db.query(sql, values);

            const dados = {
                id: result.insertId,
                nome_dos_pontos, 
                latitude_dos_pontos, 
                longitude_dos_pontos
            }

            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Cadastro de pontos realizado com sucesso',
                dados: dados
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao cadastrar pontos: ${error.message}`,
                dados: error.message
                }
            );
        }
    },
    async editarpontos (request, response) {
        try{

            const { nome_dos_pontos, latitude_dos_pontos, longitude_dos_pontos } = request.body;

            const { id } = request.params;

            const sql = `
                UPDATE pontos SET 
                    nome_pontos = ?, latitude_pontos = ?, longitude_pontos = ?
                WHERE
                    id_pontos = ?;
            `;

            const values = [ nome_dos_pontos, latitude_dos_pontos, longitude_dos_pontos, id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Pontos ${id} nâo encontrado!`,
                    dados: null
                });
            }

            const dados = {
                id_pontos: id,
                nome_dos_pontos,
                latitude_dos_pontos,
                longitude_dos_pontos 
            };

            return response.status(200).json({
                sucesso: true,
                mensagem: `Pontos ${id} atualizado com sucesso!`,
                dados
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: "Erro na requisição.",
                dados: error.message
            });
        }
    },
    async apagarpontos (request, response) {
        try{
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Exclusão de pontos realizada com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao remover pontos: ${error.message}`,
                dados: null
                }
            );
        }
    },
};