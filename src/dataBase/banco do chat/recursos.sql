-- Arquivo: recursos.sql
-- Dialeto: MySQL
-- Contém SELECTs (com listagem explícita de campos) para cada tabela
-- Contém SELECTs com INNER JOIN para tabelas que possuem chaves estrangeiras
-- Contém comandos DROP TABLE na ordem correta para apagar todas as tabelas

-- SELECTs individuais por tabela (listar todos os campos explicitamente)

-- tipo_usuarios
SELECT id_tipo_usuario, nome_tipo_usuario
FROM tipo_usuarios;

-- usuario
SELECT id_usuario, id_tipo_usuario, nome_usuario, email_usuario, senha_usuario, telefone_usuario
FROM usuario;

-- motorista
SELECT id_motorista, cpf_motorista, cnh_motorista, foto_motorista
FROM motorista;

-- onibus
SELECT id_onibus, placa_onibus, modelo_onibus, tipo_combustivel_onibus, ano_onibus
FROM onibus;

-- manutencao
SELECT id_manutencao, id_onibus, descricao_manutencao, data_inicio_manutencao, data_fim_manutencao, status_manutencao
FROM manutencao;

-- linhas
SELECT id_linha, nome_linhas, descricao_linha
FROM linhas;

-- pontos
SELECT id_pontos, nome_pontos, latitude_pontos, longitude_pontos
FROM pontos;

-- rotas
SELECT id_rota, id_ponto, id_linha, ordem_sequencia_rotas
FROM rotas;

-- rota_onibus
SELECT id_rotaOnibus, id_motorista, id_onibus, id_rota, data_ocorrencia_rota_onibus
FROM rota_onibus;

-- localizacao
SELECT id_localizacao, id_rota_onibus, latitude_localizacao, longitude_localizacao, data_hora_localizacao
FROM localizacao;

-- avaliacao
SELECT id_avaliacao, id_usuario, id_motorista, nota_avaliacao, comentario_avaliacao, data_avaliacao
FROM avaliacao;

-- horarios
SELECT id_horario, id_ponto, passagem_horarios
FROM horarios;


-- SELECTs com INNER JOIN para tabelas que possuem chaves estrangeiras
-- Apresenta os principais campos das tabelas relacionadas

-- usuario com tipo_usuarios
SELECT u.id_usuario, u.nome_usuario, u.email_usuario, u.telefone_usuario,
       t.id_tipo_usuario, t.nome_tipo_usuario
FROM usuario u
INNER JOIN tipo_usuarios t ON u.id_tipo_usuario = t.id_tipo_usuario;

-- manutencao com onibus
SELECT m.id_manutencao, m.descricao_manutencao, m.data_inicio_manutencao, m.data_fim_manutencao, m.status_manutencao,
       o.id_onibus, o.placa_onibus, o.modelo_onibus
FROM manutencao m
INNER JOIN onibus o ON m.id_onibus = o.id_onibus;

-- rotas com pontos e linhas
SELECT r.id_rota, r.ordem_sequencia_rotas,
       p.id_pontos, p.nome_pontos, p.latitude_pontos, p.longitude_pontos,
       l.id_linha, l.nome_linhas
FROM rotas r
INNER JOIN pontos p ON r.id_ponto = p.id_pontos
INNER JOIN linhas l ON r.id_linha = l.id_linha;

-- rota_onibus com motorista, onibus e rotas
SELECT ro.id_rotaOnibus, ro.data_ocorrencia_rota_onibus,
       mo.id_motorista, mo.cpf_motorista,
       o.id_onibus, o.placa_onibus,
       r.id_rota, r.ordem_sequencia_rotas
FROM rota_onibus ro
INNER JOIN motorista mo ON ro.id_motorista = mo.id_motorista
INNER JOIN onibus o ON ro.id_onibus = o.id_onibus
INNER JOIN rotas r ON ro.id_rota = r.id_rota;

-- localizacao com rota_onibus
SELECT l.id_localizacao, l.latitude_localizacao, l.longitude_localizacao, l.data_hora_localizacao,
       ro.id_rotaOnibus, ro.data_ocorrencia_rota_onibus
FROM localizacao l
INNER JOIN rota_onibus ro ON l.id_rota_onibus = ro.id_rotaOnibus;

-- avaliacao com usuario e motorista
SELECT a.id_avaliacao, a.nota_avaliacao, a.comentario_avaliacao, a.data_avaliacao,
       u.id_usuario, u.nome_usuario, u.email_usuario,
       m.id_motorista, m.cpf_motorista
FROM avaliacao a
INNER JOIN usuario u ON a.id_usuario = u.id_usuario
INNER JOIN motorista m ON a.id_motorista = m.id_motorista;

-- horarios com pontos
SELECT h.id_horario, h.passagem_horarios,
       p.id_pontos, p.nome_pontos
FROM horarios h
INNER JOIN pontos p ON h.id_ponto = p.id_pontos;


-- Comandos DROP TABLE na ordem correta (dependências respeitadas)
-- Observação: execute com cuidado, apagará todos os dados

DROP TABLE IF EXISTS localizacao;
DROP TABLE IF EXISTS avaliacao;
DROP TABLE IF EXISTS manutencao;
DROP TABLE IF EXISTS rota_onibus;
DROP TABLE IF EXISTS horarios;
DROP TABLE IF EXISTS rotas;
DROP TABLE IF EXISTS pontos;
DROP TABLE IF EXISTS linhas;
DROP TABLE IF EXISTS onibus;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS motorista;
DROP TABLE IF EXISTS tipo_usuarios;
