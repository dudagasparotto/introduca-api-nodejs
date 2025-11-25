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

            const { placa_do_onibus, modelo_do_onibus, tipo_combustivel_do_onibus, ano_do_onibus } = request.body;

            const { id } = request.params;

            const sql = `
                UPDATE onibus SET 
                    placa_onibus = ?, modelo_onibus = ?, tipo_combustivel_onibus = ?, ano_onibus = ? 
                WHERE   
                    id_onibus = ?;
            `;

            const values = [ placa_do_onibus, modelo_do_onibus, tipo_combustivel_do_onibus, ano_do_onibus, id];

            const [ result ] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Usuário ${id} nâo encontrado!`,
                    dados: null
                });
            }

            const dados = {
                id_onibus: id,
                placa_do_onibus,
                modelo_do_onibus,
                tipo_combustivel_do_onibus,
                ano_do_onibus 
            };

            return response.status(200).json({
                sucesso: true,
                mensagem: `Usuário ${id} atualizado com sucesso!`,
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