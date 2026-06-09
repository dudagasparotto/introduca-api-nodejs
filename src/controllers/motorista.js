const { response, request } = require('express');
const db = require('../dataBase/connection');

module.exports = {
    async listarMotorista(request, response) {
        try {
            const { nome } = request.query;

            const id_motorista = nome ? `%${nome}%` : `%`;
            const sql = `
                SELECT 
                    id_motorista, 
                    nome_motorista,
                    cpf_motorista,
                    cnh_motorista, 
                    foto_motorista
                FROM 
                    motorista
                WHERE
                    nome_motorista LIKE ?
                ORDER BY
                    id_motorista;
            `;

            const values = [id_motorista];

            const [rows] = await db.query(sql, values);
            const [avaliacoes] = await db.query(`
                SELECT
                    id_avaliacao,
                    id_motorista,
                    nota_avaliacao,
                    comentario_avaliacao,
                    data_avaliacao
                FROM avaliacao
                ORDER BY data_avaliacao DESC, id_avaliacao DESC;
            `);
            const [vinculosRotas] = await db.query(`
                SELECT
                    mr.id_motorista,
                    r.id_rota,
                    l.nome_linhas
                FROM motoristas_rotas mr
                INNER JOIN rotas r
                    ON r.id_rota = mr.id_rota
                INNER JOIN linhas l
                    ON l.id_linha = r.id_linha
                ORDER BY l.nome_linhas ASC;
            `);
            const avaliacoesPorMotorista = avaliacoes.reduce((grupos, avaliacao) => {
                const idMotorista = Number(avaliacao.id_motorista);

                if (!grupos.has(idMotorista)) {
                    grupos.set(idMotorista, []);
                }

                grupos.get(idMotorista).push(avaliacao);
                return grupos;
            }, new Map());
            const rotasPorMotorista = vinculosRotas.reduce((grupos, rota) => {
                const idMotorista = Number(rota.id_motorista);

                if (!grupos.has(idMotorista)) {
                    grupos.set(idMotorista, []);
                }

                grupos.get(idMotorista).push({
                    id_rota: rota.id_rota,
                    nome_rota: rota.nome_linhas
                });
                return grupos;
            }, new Map());
            const dados = rows.map((motorista) => {
                const avaliacoesDoMotorista =
                    avaliacoesPorMotorista.get(Number(motorista.id_motorista)) || [];
                const somaNotas = avaliacoesDoMotorista.reduce(
                    (total, avaliacao) =>
                        total + Number(avaliacao.nota_avaliacao || 0),
                    0
                );

                return {
                    ...motorista,
                    rotas:
                        rotasPorMotorista.get(Number(motorista.id_motorista)) || [],
                    avaliacoes: avaliacoesDoMotorista,
                    total_avaliacoes: avaliacoesDoMotorista.length,
                    media_avaliacao: avaliacoesDoMotorista.length
                        ? Number((somaNotas / avaliacoesDoMotorista.length).toFixed(1))
                        : 0
                };
            });
            const nItens = rows.length;

            return response.status(200).json({
                sucesso: true, 
                mensagem: 'listar motorista',
                nItens,
                dados
            });

        } catch (error) {
            return response.status(500).json({
            sucesso: false, 
            mensagem: 'Erro ao listar motorista.',
            dados: error.message
            });
        }           
    },

    async buscarMotorista(request, response) {

        try {

            const { id } = request.params;

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

            const [rows] =
                await db.query(sql, values);

            if (rows.length === 0) {

                return response.status(404).json({

                    sucesso: false,
                    mensagem: 'Motorista não encontrado',
                    dados: null

                });

            }

            return response.status(200).json({

                sucesso: true,
                mensagem: 'Motorista encontrado',
                dados: rows[0]

            });

        } catch (error) {

            return response.status(500).json({

                sucesso: false,
                mensagem:
                    'Erro ao buscar motorista.',
                dados: error.message

            });

        }

    },

    async listarRotasDoMotorista(request, response) {

        try {

            const { id } = request.params;

            const motoristaSql = `
                SELECT
                    id_motorista,
                    nome_motorista,
                    foto_motorista
                FROM motorista
                WHERE id_motorista = ?;
            `;

            const rotasSql = `
                SELECT DISTINCT
                    r.id_rota,
                    r.id_linha,
                    l.nome_linhas AS nome_rota
                FROM motoristas_rotas mr
                INNER JOIN rotas r
                    ON r.id_rota = mr.id_rota
                INNER JOIN linhas l
                    ON l.id_linha = r.id_linha
                WHERE mr.id_motorista = ?
                ORDER BY l.nome_linhas ASC;
            `;

            const pontosSql = `
                SELECT
                    p.id_rota,
                    p.id_pontos,
                    p.nome_pontos
                FROM pontos p
                INNER JOIN motoristas_rotas mr
                    ON mr.id_rota = p.id_rota
                WHERE mr.id_motorista = ?
                ORDER BY
                    p.id_rota ASC,
                    p.id_pontos ASC;
            `;

            const [motoristas] = await db.query(motoristaSql, [id]);

            if (motoristas.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Motorista nao encontrado',
                    dados: null
                });
            }

            const [rotas] = await db.query(rotasSql, [id]);
            const [pontos] = await db.query(pontosSql, [id]);

            const dadosRotas = rotas.map((rota) => {
                const pontosDaRota = pontos.filter(
                    (ponto) => ponto.id_rota === rota.id_rota
                );

                return {
                    id_rota: rota.id_rota,
                    id_linha: rota.id_linha,
                    nome_rota: rota.nome_rota,
                    origem: pontosDaRota[0]?.nome_pontos || '',
                    destino: pontosDaRota[pontosDaRota.length - 1]?.nome_pontos || '',
                    quantidade_pontos: pontosDaRota.length,
                    status: 'Ativa'
                };
            });

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Rotas do motorista carregadas com sucesso',
                dados: {
                    id_motorista: motoristas[0].id_motorista,
                    nome: motoristas[0].nome_motorista,
                    foto: motoristas[0].foto_motorista,
                    rotas: dadosRotas
                }
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar rotas do motorista: ${error.message}`,
                dados: null
            });

        }

    },

    async atualizarRotasDoMotorista(request, response) {

        const connection = await db.getConnection();

        try {

            const { id } = request.params;
            const idsRotasRecebidos = Array.isArray(request.body.ids_rotas)
                ? request.body.ids_rotas
                : [];
            const idsRotas = [
                ...new Set(
                    idsRotasRecebidos
                        .map((idRota) => Number(idRota))
                        .filter((idRota) => Number.isInteger(idRota) && idRota > 0)
                )
            ];

            if (idsRotas.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Selecione pelo menos uma rota para o motorista.',
                    dados: null
                });
            }

            await connection.beginTransaction();

            const [motoristas] = await connection.query(
                'SELECT id_motorista FROM motorista WHERE id_motorista = ?;',
                [id]
            );

            if (motoristas.length === 0) {
                await connection.rollback();

                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Motorista nao encontrado.',
                    dados: null
                });
            }

            const placeholders = idsRotas.map(() => '?').join(', ');
            const [rotas] = await connection.query(
                `SELECT id_rota FROM rotas WHERE id_rota IN (${placeholders});`,
                idsRotas
            );

            if (rotas.length !== idsRotas.length) {
                await connection.rollback();

                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Uma ou mais rotas selecionadas nao existem.',
                    dados: null
                });
            }

            await connection.query(
                'DELETE FROM motoristas_rotas WHERE id_motorista = ?;',
                [id]
            );

            const valores = idsRotas.map((idRota) => [Number(id), idRota]);

            await connection.query(
                'INSERT INTO motoristas_rotas (id_motorista, id_rota) VALUES ?;',
                [valores]
            );

            await connection.commit();

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Rotas do motorista atualizadas com sucesso.',
                dados: {
                    id_motorista: Number(id),
                    ids_rotas: idsRotas
                }
            });

        } catch (error) {

            await connection.rollback();

            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao atualizar rotas do motorista: ${error.message}`,
                dados: null
            });

        } finally {

            connection.release();

        }

    },

    async cadastrarMotorista(request, response) {
        try {
            const {
                id_motorista,
                nome_motorista,
                cpf_motorista,
                cnh_motorista,
                foto_motorista
            } = request.body;
            const caminhoFoto = request.file
                ? `fotos/motoristas/${request.file.filename}`
                : foto_motorista || null;

            if (!id_motorista || !nome_motorista || !cpf_motorista || !cnh_motorista) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'ID, nome, CPF e CNH sao obrigatorios.',
                    dados: null
                });
            }

            //instrução sql
            const sql  = `INSERT INTO motorista (id_motorista, nome_motorista, cpf_motorista, cnh_motorista, foto_motorista)
             VALUES (?,?,?,?,?);`; 

            //Definição dos dados a serem inseridos em uma array
            const values = [
                id_motorista,
                nome_motorista,
                cpf_motorista,
                cnh_motorista,
                caminhoFoto
            ];

            //Execulsão da instrução sql passando os parametros 
            const [result] = await db.query (sql, values);

            
            // Definição do ID  do registro inserido
            const dados = {
                id: Number(id_motorista),
                id_motorista: Number(id_motorista),
                nome_motorista,
                cpf_motorista,
                cnh_motorista,
                foto_motorista: caminhoFoto
            }
            return response.status(201).json({
                sucesso: true, 
                mensagem: 'Cadastro do motorista realizado com sucesso', 
                dados: dados 
            }); 
        }

        catch (error) {
            return response.status(500).json({
                sucesso: false, 
                mensagem: `Erro ao cadastrar motorista  ${error.message}`,
                dados: error.message
            }); 
        } 
    }, 

    async atualizarMotorista(request, response) {
        try {
            // Parametros recebidos pelo corpo da requisição 
            const { nome_motorista, cpf_motorista, cnh_motorista, foto_motorista } = request.body;
            const caminhoFoto = request.file
                ? `fotos/motoristas/${request.file.filename}`
                : foto_motorista || null;

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
            const values = [nome_motorista, cpf_motorista, cnh_motorista, caminhoFoto, id];

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
            id_motorista: Number(id),
            nome_motorista,
            cpf_motorista,
            cnh_motorista,
            foto_motorista: caminhoFoto
            };

        return response.status(200).json({
            sucesso: true, 
            mensagem: 'usuario ${id} atualizado com sucesso',
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
