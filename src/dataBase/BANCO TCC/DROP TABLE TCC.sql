DROP TABLE IF EXISTS localizacao;
DROP TABLE IF EXISTS avaliacao;
DROP TABLE IF EXISTS manutencao;
DROP TABLE IF EXISTS rota_onibus;
DROP TABLE IF EXISTS horarios;
DROP TABLE IF EXISTS rotas;
DROP TABLE IF EXISTS pontos;
DROP TABLE IF EXISTS linhas;
DROP TABLE IF EXISTS onibus;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS motorista;
DROP TABLE IF EXISTS tipo_usuarios;

-- Rotas (6 registros) -> cada rota referencia um ponto e uma linha