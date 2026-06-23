const db = require('../dataBase/connection');

function obterDadosPonto(body) {
    const nome_pontos = body.nome_pontos ?? body.nome_dos_pontos;
    const latitude_pontos = Number(
        body.latitude_pontos ?? body.latitude_dos_pontos
    );
    const longitude_pontos = Number(
        body.longitude_pontos ?? body.longitude_dos_pontos
    );
    const id_rota = Number(body.id_rota);

    return {
        nome_pontos: String(nome_pontos || '').trim(),
        latitude_pontos,
        longitude_pontos,
        id_rota
    };
}

function coordenadasInvalidas(latitude, longitude) {
    return (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
    );
}

function validarDadosPonto(dados) {
    if (!dados.nome_pontos) {
        return 'Informe o nome do ponto.';
    }

    if (coordenadasInvalidas(dados.latitude_pontos, dados.longitude_pontos)) {
        return 'Marque um ponto valido no mapa para salvar latitude e longitude.';
    }

    if (!Number.isInteger(dados.id_rota) || dados.id_rota <= 0) {
        return 'Selecione uma rota para salvar o ponto.';
    }

    return null;
}

module.exports = {
    async listarpontos(request, response) {
        try {
            const { nome } = request.query;

            const nome_pontos = nome ? `%${nome}%` : '%';
            const sql = `
                SELECT
                    id_pontos,
                    nome_pontos,
                    latitude_pontos,
                    longitude_pontos,
                    id_rota
                FROM
                    pontos
                WHERE
                    nome_pontos LIKE ?
                ORDER BY
                    id_pontos ASC;
            `;

            const values = [nome_pontos];

            const [rows] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista dos pontos obtida com sucesso',
                nItens: rows.length,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar os pontos: ${error.message}`,
                dados: error.message
            });
        }
    },

    async cadastrarpontos(request, response) {
        try {
            const dadosPonto = obterDadosPonto(request.body);
            const mensagemErro = validarDadosPonto(dadosPonto);

            if (mensagemErro) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: mensagemErro,
                    dados: null
                });
            }

            const sql = `
                INSERT INTO pontos
                    (nome_pontos, latitude_pontos, longitude_pontos, id_rota)
                VALUES
                    (?, ?, ?, ?);
            `;

            const values = [
                dadosPonto.nome_pontos,
                dadosPonto.latitude_pontos,
                dadosPonto.longitude_pontos,
                dadosPonto.id_rota
            ];

            const [result] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de pontos realizado com sucesso',
                dados: {
                    id: result.insertId,
                    id_pontos: result.insertId,
                    nome_pontos: dadosPonto.nome_pontos,
                    latitude_pontos: dadosPonto.latitude_pontos,
                    longitude_pontos: dadosPonto.longitude_pontos,
                    id_rota: dadosPonto.id_rota
                }
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao cadastrar pontos: ${error.message}`,
                dados: error.message
            });
        }
    },

    async editarpontos(request, response) {
        try {
            const dadosPonto = obterDadosPonto(request.body);
            const mensagemErro = validarDadosPonto(dadosPonto);

            if (mensagemErro) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: mensagemErro,
                    dados: null
                });
            }

            const { id } = request.params;

            const sql = `
                UPDATE pontos SET
                    nome_pontos = ?,
                    latitude_pontos = ?,
                    longitude_pontos = ?,
                    id_rota = ?
                WHERE
                    id_pontos = ?;
            `;

            const values = [
                dadosPonto.nome_pontos,
                dadosPonto.latitude_pontos,
                dadosPonto.longitude_pontos,
                dadosPonto.id_rota,
                id
            ];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Ponto ${id} não encontrado!`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: `Ponto ${id} atualizado com sucesso!`,
                dados: {
                    id_pontos: Number(id),
                    nome_pontos: dadosPonto.nome_pontos,
                    latitude_pontos: dadosPonto.latitude_pontos,
                    longitude_pontos: dadosPonto.longitude_pontos,
                    id_rota: dadosPonto.id_rota
                }
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async apagarpontos(request, response) {
        try {
            const { id } = request.params;

            const sql = `
                DELETE FROM pontos
                WHERE id_pontos = ?;
            `;

            const [result] = await db.query(sql, [id]);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Ponto ${id} não encontrado!`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Exclusão de pontos realizada com sucesso',
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao remover pontos: ${error.message}`,
                dados: null
            });
        }
    },
};
