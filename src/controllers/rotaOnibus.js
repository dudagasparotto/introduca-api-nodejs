const db = require('../dataBase/connection');

module.exports = {
    async listarrotaOnibus (request, response) {
        try{

            const sql = `
                SELECT id_rotaOnibus, id_motorista, id_onibus, id_rota, data_ocorrencia_rota_onibus
                FROM rota_onibus;
            `;

            const [rotaOnibus] = await db.query(sql);

            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Lista da rota do ônibus obtida com sucesso',
                itens: rotaOnibus.length,
                dados: rotaOnibus
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao listar a rota de ônibus: ${error.message}`,
                dados: null
                }
            );
        }
    },
    async cadastrarrotaOnibus (request, response) {
        try{
            
            const { id_do_Motora, id_do_Onibus, id_da_Rota, data_ocorrencia } = request.body;

            const sql = `
                INSERT INTO rota_onibus 
                    (id_motorista, id_onibus, id_rota, data_ocorrencia_rota_onibus) 
                VALUES
                    (?, ?, ?, ?);
            `;

            const values = [id_do_Motora, id_do_Onibus, id_da_Rota, data_ocorrencia];

            const [result] = await db.query(sql, values);

            const dados = {
                id: result.insertId,
                id_do_Motora,
                id_do_Onibus,
                id_da_Rota,
                data_ocorrencia
            };

            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Cadastro de rota de ônibus realizado com sucesso',
                dados: dados
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao cadastrar rota de ônibus: ${error.message}`,
                dados: error.message
                }
            );
        }
    },
    async editarrotaOnibus (request, response) {
        try{
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Atualização de rota de ônibus realizado com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao atualizar a rota de ônibus: ${error.message}`,
                dados: null
                }
            );
        }
    },
    async apagarrotaOnibus (request, response) {
        try{
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Exclusão de rota de ônibus realizada com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao remover rota de ônibus: ${error.message}`,
                dados: null
                }
            );
        }
    },
};