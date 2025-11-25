const db = require('../dataBase/connection');

module.exports = {
    async listaronibus (request, response) {
        try{

            const sql = `
                SELECT 
                    id_onibus, placa_onibus, modelo_onibus, tipo_combustivel_onibus, ano_onibus
                FROM onibus;
            `;

            const [onibus] = await db.query(sql);

            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Lista do onibus obtida com sucesso',
                dados: onibus
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao listar o onibus: ${error.message}`,
                dados: error.message
                }
            );
        }
    },
    async cadastraronibus (request, response) {
        try{

            const {placa_do_onibus, modelo_do_onibus, tipo_combustivel_do_onibus, ano_do_onibus} = request.body;

            const sql = `
                INSERT INTO onibus 
                    (placa_onibus, modelo_onibus, tipo_combustivel_onibus, ano_onibus) 
                VALUES
                    (?, ?, ?, ?);
            `;

            const values = [placa_do_onibus, modelo_do_onibus, tipo_combustivel_do_onibus, ano_do_onibus];

            const [result] = await db.query(sql, values);

            const dados = {
                id: result.insertId,
                placa_do_onibus, 
                modelo_do_onibus,
                tipo_combustivel_do_onibus, 
                ano_do_onibus
            };

            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Cadastro de onibus realizado com sucesso',
                dados: dados
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao cadastrar onibus: ${error.message}`,
                dados: error.message
                }
            );
        }
    },
    async editaronibus (request, response) {
        try{
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Atualização de onibus realizado com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao atualizar o onibus: ${error.message}`,
                dados: null
                }
            );
        }
    },
    async apagaronibus (request, response) {
        try{
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Exclusão de onibus realizada com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao remover onibus: ${error.message}`,
                dados: null
                }
            );
        }
    },
};