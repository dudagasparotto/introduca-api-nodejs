const db = require('../dataBase/connection');

module.exports = {
    async listarlocalizacao (request, response) {
        try{

            const sql = `
                SELECT 
                    id_localizacao, id_rota_onibus, latitude_localizacao, longitude_localizacao, data_hora_localizacao
                FROM localizacao;
            `;

            const [localizacao] = await db.query(sql); 

            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Lista de localizacao obtida com sucesso',
                dados: localizacao
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao listar a localizacao: ${error.message}`,
                dados: error.message
                }
            );
        }
    },
    async cadastrarlocalizacao (request, response) {
        try{

            const {id_da_rota_onibus, latitude_da_localizacao, longitude_da_localizacao, data_da_hora_localizacao} = request.body;

            const sql = `
                INSERT INTO localizacao 
                    (id_rota_onibus, latitude_localizacao, longitude_localizacao, data_hora_localizacao) 
                VALUES
                    (?, ?, ?, ?);
            `;

            const values = [id_da_rota_onibus, latitude_da_localizacao, longitude_da_localizacao, data_da_hora_localizacao];

            const [result] = await db.query(sql, values);

            const dados = {
                id: result.insertId,
                id_da_rota_onibus, 
                latitude_da_localizacao, 
                longitude_da_localizacao, 
                data_da_hora_localizacao
            }

            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Cadastro de localizacao realizado com sucesso',
                dados: dados
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao cadastrar localizacao: ${error.message}`,
                dados: error.message
                }
            );
        }
    },
    async editarlocalizacao (request, response) {
        try{
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Atualização de localizacao realizado com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao atualizar a localizacao: ${error.message}`,
                dados: null
                }
            );
        }
    },
    async apagarlocalizacao (request, response) {
        try{
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Exclusão de localizacao realizada com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao remover localizacao: ${error.message}`,
                dados: null
                }
            );
        }
    },
};