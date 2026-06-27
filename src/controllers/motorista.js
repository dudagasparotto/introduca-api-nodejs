const { response, request } = require('express');
const db = require('../dataBase/connection');

module.exports = {
    async listarMotorista(request, response) {
        try {
            const { nome } = request.query;

            const id_motorista = nome ? `%${nome}%` : `%`;
            const sql = `
                SELECT 
                    id_motorista,nome_motorista, cpf_motorista, cnh_motorista, foto_motorista
                FROM 
                    motorista
                ORDER BY
                    id_motorista like ?;
            `;

            const values = [id_motorista];

            const [rows] = await db.query(sql, values);
            const nItens = rows.length;

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'listar motorista',
                nItens,
                dados: rows
            });

        } catch (error) {
            return response.status(500).json({
            sucesso: false, 
            mensagem: 'Erro ao listar motorista.',
            dados: error.message
            });
        }           
    },

   async cadastrarMotorista(request, response) {

    try {

        const {
            id_motorista,
            nome_motorista,
            cpf_motorista,
            cnh_motorista
        } = request.body;

        if (!nome_motorista || !cpf_motorista || !cnh_motorista) {
            return response.status(400).json({
                sucesso: false,
                mensagem: 'Informe nome_motorista, cpf_motorista e cnh_motorista.',
                dados: null
            });
        }

        const cpfLimpo = String(cpf_motorista).replace(/\D/g, '');
        const cnhLimpa = String(cnh_motorista).replace(/\D/g, '');

        if (!cpfLimpo || !cnhLimpa) {
            return response.status(400).json({
                sucesso: false,
                mensagem: 'CPF e CNH devem conter apenas números válidos.',
                dados: null
            });
        }

        const foto_motorista =
            request.file ? `uploads/${request.file.filename}` : null;

        const sql = `
            INSERT INTO motorista
            (
                id_motorista,
                nome_motorista,
                cpf_motorista,
                cnh_motorista,
                foto_motorista
            )
            SELECT
                LAST_INSERT_ID(COALESCE(?, COALESCE(MAX(id_motorista), 0) + 1)),
                ?,
                ?,
                ?,
                ?
            FROM motorista;
        `;

        const values = [
            id_motorista || null,
            nome_motorista,
            cpfLimpo,
            cnhLimpa,
            foto_motorista
        ];

        const [result] = await db.query(sql, values);
        const idCadastrado = id_motorista || result.insertId;

        const dados = {
            id: idCadastrado,
            nome_motorista,
            cpf_motorista: cpfLimpo,
            cnh_motorista: cnhLimpa,
            foto_motorista
        };

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Cadastro do motorista realizado com sucesso',
            dados
        });

    } catch (error) {

        console.log(error);

        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao cadastrar motorista',
            dados: error.message
        });

    }

},

    async atualizarMotorista(request, response) {
        try {
            // Parametros recebidos pelo corpo da requisição 
            const {
                nome_motorista,
                cpf_motorista,
                cnh_motorista,
                foto_motorista: fotoAtual
            } = request.body || {};

            if (!nome_motorista || !cpf_motorista || !cnh_motorista) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Informe nome, CPF e CNH do motorista.',
                    dados: null
                });
            }

            const foto_motorista = request.file
                ? `uploads/${request.file.filename}`
                : fotoAtual || null;

            //parametro recebido pela URL da requisição
            const {id} = request.params;

            // Instrução SQL para atualização do registro
            const sql =`
                UPDATE 
                    motorista 
                SET 
                   nome_motorista=?, cpf_motorista = ?, cnh_motorista = ?, foto_motorista = ? 
                WHERE 
                    id_motorista = ?;
            `;

            // Preparo do array com dados a serem atualizados
            const values = [nome_motorista, cpf_motorista, cnh_motorista, foto_motorista, id];

            //Execulsão da instrução sql passando os parametros
            const  [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            return response.status(404).json({
                sucesso: false,
                mensagem: `Motorista ID ${id} não encontrado!`,
                dados: null
            });
        }   

            const dados = {
            id,
            nome_motorista,
            cpf_motorista,
            cnh_motorista,
            foto_motorista
            };

        return response.status(200).json({
            sucesso: true, 
            mensagem: `Motorista ${id} atualizado com sucesso`,
            dados
        }); 

        }
    
        catch (error) {
            return response.status(500).json({
                sucesso: false, 
                mensagem: 'Erro ao atualizar motorista',
                dados: error.message
            }); 
        } 
    }, 
    async buscarMotorista(req, res) {
    try {

        const { id } = req.params;

        const sql = `
            SELECT
                id_motorista,
                nome_motorista,
                cpf_motorista,
                cnh_motorista,
                foto_motorista
            FROM motorista
            WHERE id_motorista = ?;
        `;

        const values = [id];

        const [rows] = await db.query(sql, values);

        if (rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Motorista não encontrado'
            });
        }

        return res.status(200).json({
            sucesso: true,
            dados: rows[0]
        });

    } catch (error) {

        return res.status(500).json({
            sucesso: false,
            mensagem: error.message
        });

    }
},  
            
    async apagarMotorista(request, response) {
        try { 

            //parametro passando via url na chamada da api pelo front-end 
            const { id } = request.params; 
            
            //comando de exclusão
            const sql =`
            DELETE FROM 
                motorista 
            WHERE
               id_motorista = ?;
            `;

            //array com os parametros da exclusão 
            const values = [id]; 

            // execulta instrução no banco de dados 
            const [result] = await db.query (sql, values); 

        if (result.affectedRows === 0){
            return response.status (404).json({
                sucesso: false, 
                mensagem: `Usuário ${id} não encontrado!`, 
                dados: null
            }); 
        }

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'motorista apagado com sucesso',
                dados: null
            }); 

        }
        
        catch (error) {
            return response.status(500).json({
                sucesso: false, 
                mensagem: 'Erro ao apagar motorista',
                dados: error.message
            });

        }
    }                           
};
