const db = require('../dataBase/connection');

async function buscarMotoristasDaRota(idRota) {
    const sql = `
        SELECT
            m.id_motorista,
            m.nome_motorista AS nome,
            m.foto_motorista AS foto,
            'Ativo' AS status,
            ROUND(AVG(a.nota_avaliacao), 1) AS media_avaliacao
        FROM motoristas_rotas mr
        INNER JOIN motorista m
            ON m.id_motorista = mr.id_motorista
        LEFT JOIN avaliacao a
            ON a.id_motorista = m.id_motorista
        WHERE mr.id_rota = ?
        GROUP BY
            m.id_motorista,
            m.nome_motorista,
            m.foto_motorista
        ORDER BY
            m.nome_motorista ASC;
    `;

    const [rows] = await db.query(sql, [idRota]);

    return rows.map((motorista) => ({
        id_motorista: motorista.id_motorista,
        nome: motorista.nome,
        foto: motorista.foto,
        status: motorista.status,
        media_avaliacao: motorista.media_avaliacao || 0
    }));
}

function formatarHorario(horario) {
    return horario ? String(horario).slice(0, 5) : '';
}

function calcularProximaSaida(horarios) {
    const horariosValidos = horarios
        .map((horario) => formatarHorario(horario.passagem_horarios))
        .filter(Boolean)
        .sort();

    if (horariosValidos.length === 0) {
        return null;
    }

    const agora = new Date();
    const horarioAtual = `${String(agora.getHours()).padStart(2, '0')}:${String(
        agora.getMinutes()
    ).padStart(2, '0')}`;

    return horariosValidos.find((horario) => horario >= horarioAtual) || horariosValidos[0];
}

function corValida(cor) {
    return /^#[0-9A-F]{6}$/i.test(String(cor || ''));
}

function normalizarTrajeto(trajeto) {
    if (trajeto === null || trajeto === undefined || trajeto === '') {
        return null;
    }

    const coordenadas = typeof trajeto === 'string'
        ? JSON.parse(trajeto)
        : trajeto;

    if (
        !Array.isArray(coordenadas) ||
        !coordenadas.every((ponto) => {
            if (!Array.isArray(ponto) || ponto.length !== 2) {
                return false;
            }

            const latitude = Number(ponto[0]);
            const longitude = Number(ponto[1]);

            return (
                Number.isFinite(latitude) &&
                Number.isFinite(longitude) &&
                latitude >= -90 &&
                latitude <= 90 &&
                longitude >= -180 &&
                longitude <= 180
            );
        })
    ) {
        throw new Error('Trajeto invalido');
    }

    return JSON.stringify(
        coordenadas.map((ponto) => [Number(ponto[0]), Number(ponto[1])])
    );
}

module.exports = {
    async listarVinculosMotoristasRotas(request, response) {

        try {

            const sql = `
                SELECT
                    id_motorista_rota,
                    id_motorista,
                    id_rota
                FROM motoristas_rotas
                ORDER BY
                    id_rota,
                    id_motorista;
            `;

            const [vinculos] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Vinculos entre motoristas e rotas carregados com sucesso',
                itens: vinculos.length,
                dados: vinculos
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar vinculos entre motoristas e rotas: ${error.message}`,
                dados: []
            });

        }

    },

    async listarrotas(request, response) {

        try {

            const sql = `
                SELECT
                    r.id_rota,
                    NULL AS id_ponto,
                    r.id_linha,
                    r.cor,
                    r.trajeto,
                    l.nome_linhas
                FROM rotas r
                INNER JOIN linhas l
                    ON r.id_linha = l.id_linha;
            `;

            const [rotas] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista da rota obtida com sucesso',
                itens: rotas.length,
                dados: rotas
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar a rota: ${error.message}`,
                dados: null
            });

        }

    },

    async listarRotasComPontos(request, response) {

        try {

            const sql = `
                SELECT
                    r.id_rota,
                    l.id_linha,
                    l.nome_linhas,
                    r.cor,
                    r.trajeto,
                    p.id_pontos,
                    p.nome_pontos,
                    p.latitude_pontos,
                    p.longitude_pontos
                FROM rotas r

                INNER JOIN linhas l
                    ON r.id_linha = l.id_linha

                LEFT JOIN pontos p
                    ON p.id_rota = r.id_rota

                ORDER BY
                    l.nome_linhas ASC,
                    p.id_pontos ASC
            `;

            const [rows] = await db.query(sql);

            const linhasMap = {};

            rows.forEach((item) => {

                if (!linhasMap[item.id_rota]) {

                    linhasMap[item.id_rota] = {
                        id_rota: item.id_rota,
                        id_linha: item.id_linha,
                        nome_linha: item.nome_linhas,
                        nome_linhas: item.nome_linhas,
                        cor: item.cor,
                        trajeto: item.trajeto,
                        pontos: []
                    };

                }

                if (item.id_pontos) {
                    linhasMap[item.id_rota].pontos.push({
                        id_ponto: item.id_pontos,
                        nome_ponto: item.nome_pontos,
                        latitude: item.latitude_pontos,
                        longitude: item.longitude_pontos,
                        horarios: []
                    });
                }

            });

            const dados = Object.values(linhasMap);

            return response.status(200).json({
                sucesso: true,
                dados
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: error.message
            });

        }

    },

    async listarPontosDaRota(request, response) {

        try {

            const { id } = request.params;

            const sql = `
                SELECT
                    id_pontos,
                    nome_pontos,
                    latitude_pontos,
                    longitude_pontos,
                    id_rota
                FROM pontos
                WHERE id_rota = ?
                ORDER BY id_pontos ASC;
            `;

            const [pontos] = await db.query(sql, [id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Pontos da rota carregados com sucesso',
                itens: pontos.length,
                dados: pontos.map((ponto) => ({
                    id_ponto: ponto.id_pontos,
                    id_pontos: ponto.id_pontos,
                    nome_ponto: ponto.nome_pontos,
                    nome_pontos: ponto.nome_pontos,
                    latitude: ponto.latitude_pontos,
                    longitude: ponto.longitude_pontos,
                    id_rota: ponto.id_rota
                }))
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar pontos da rota: ${error.message}`,
                dados: []
            });

        }

    },

    async listarMotoristasDaRota(request, response) {

        try {

            const { id } = request.params;
            const motoristas = await buscarMotoristasDaRota(id);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Motoristas da rota carregados com sucesso',
                itens: motoristas.length,
                dados: motoristas
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao listar motoristas da rota: ${error.message}`,
                dados: []
            });

        }

    },

    async buscarDetalhesDaRota(request, response) {

        try {

            const { id } = request.params;

            const rotaSql = `
                SELECT
                    r.id_rota,
                    r.id_linha,
                    r.cor,
                    r.trajeto,
                    l.nome_linhas AS nome_rota
                FROM rotas r
                INNER JOIN linhas l
                    ON l.id_linha = r.id_linha
                WHERE r.id_rota = ?;
            `;

            const [rotas] = await db.query(rotaSql, [id]);

            if (rotas.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Rota nao encontrada',
                    dados: null
                });
            }

            const pontosSql = `
                SELECT
                    id_pontos,
                    nome_pontos,
                    latitude_pontos,
                    longitude_pontos
                FROM pontos
                WHERE id_rota = ?
                ORDER BY id_pontos ASC;
            `;

            const horariosSql = `
                SELECT
                    h.id_horario,
                    h.id_ponto,
                    h.passagem_horarios,
                    p.nome_pontos
                FROM horarios h
                INNER JOIN pontos p
                    ON p.id_pontos = h.id_ponto
                WHERE p.id_rota = ?
                ORDER BY
                    p.nome_pontos ASC,
                    h.passagem_horarios ASC;
            `;

            const [pontos] = await db.query(pontosSql, [id]);
            const [horarios] = await db.query(horariosSql, [id]);
            const motoristas = await buscarMotoristasDaRota(id);
            const rota = rotas[0];

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Rota carregada com sucesso',
                dados: {
                    id_rota: rota.id_rota,
                    id_linha: rota.id_linha,
                    nome_rota: rota.nome_rota,
                    cor: rota.cor,
                    trajeto: rota.trajeto,
                    proxima_saida: calcularProximaSaida(horarios),
                    pontos: pontos.map((ponto) => ({
                        id_ponto: ponto.id_pontos,
                        nome_ponto: ponto.nome_pontos,
                        latitude: ponto.latitude_pontos,
                        longitude: ponto.longitude_pontos
                    })),
                    horarios: horarios.map((horario) => ({
                        id_horario: horario.id_horario,
                        id_ponto: horario.id_ponto,
                        nome_ponto: horario.nome_pontos,
                        hora: formatarHorario(horario.passagem_horarios)
                    })),
                    motoristas
                }
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: `Erro ao buscar detalhes da rota: ${error.message}`,
                dados: null
            });

        }

    },

    async cadastrarrotas (request, response) {
        try{
            const { id_da_Linha, cor = '#6B7280' } = request.body;

            if (!id_da_Linha) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Informe a linha da rota',
                    dados: null
                });
            }

            if (!corValida(cor)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Informe uma cor valida no formato hexadecimal',
                    dados: null
                });
            }

            const [ultimaRota] = await db.query(`
                SELECT COALESCE(MAX(id_rota), 0) + 1 AS proximo_id
                FROM rotas;
            `);

            const idRota = ultimaRota[0].proximo_id;

            const sql = `
                INSERT INTO rotas 
                    (id_rota, id_linha, cor)
                VALUES
                    (?, ?, ?);
            `;

            const values = [idRota, id_da_Linha, cor.toUpperCase()];

            await db.query(sql, values);

            const dados = {
                id: idRota,
                id_da_Linha,
                cor: cor.toUpperCase()
            };

            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Cadastro de rota realizado com sucesso',
                dados: dados
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao cadastrar rota: ${error.message}`,
                dados: error.message
                }
            );
        }
    },
    async editarrotas (request, response) {
        try {
            const { id_do_Ponto, id_da_Linha, cor, trajeto } = request.body;
            const { id } = request.params;
            const campos = [];
            const values = [];

            if (id_do_Ponto !== undefined) {
                campos.push('id_ponto = ?');
                values.push(id_do_Ponto || null);
            }

            if (id_da_Linha !== undefined) {
                campos.push('id_linha = ?');
                values.push(id_da_Linha);
            }

            if (cor !== undefined) {
                if (!corValida(cor)) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: 'Informe uma cor valida no formato hexadecimal',
                        dados: null
                    });
                }

                campos.push('cor = ?');
                values.push(String(cor).toUpperCase());
            }

            if (trajeto !== undefined) {
                let trajetoNormalizado;

                try {
                    trajetoNormalizado = normalizarTrajeto(trajeto);
                } catch {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: 'O trajeto possui coordenadas invalidas',
                        dados: null
                    });
                }

                campos.push('trajeto = ?');
                values.push(trajetoNormalizado);
            }

            if (campos.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Informe os dados da rota que deseja atualizar',
                    dados: null
                });
            }
            
            const sql = `
                UPDATE rotas
                SET ${campos.join(', ')}
                WHERE id_rota = ?;
            `;

            values.push(id);

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Linha ${id} não encontrado!`,
                    dados: null
                });
            }
            
            const dados = {
                id, 
                id_do_Ponto, 
                id_da_Linha
            };
            return response.status(200).json(
                {
                sucesso: true,
                mensagem: `Atualização de rota ${id} realizado com sucesso`,
                dados
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao atualizar a rota: ${error.message}`,
                dados: null
                }
            );
        }
    },
    async apagarrotas (request, response) {
        try{
            const {id} = request.params;
            
            const sql = `DELETE FROM rotas WHERE id_rota = ?`;
            
            const values = [id];

            const [result] = await db.query(sql, values);

            if (result.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Rota ${id} não encontrada!`,
                    dados: null
                });
            }

            return response.status(200).json(
                {
                sucesso: true,
                mensagem: 'Exclusão de rota realizada com sucesso',
                dados: null
                }
            );
        } catch (error) {
            return response.status(500).json(
                {
                sucesso: false,
                mensagem: `Erro ao remover rota: ${error.message}`,
                dados: null
                }
            );
        }
    },
};
