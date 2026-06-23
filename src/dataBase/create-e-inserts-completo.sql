-- Script completo do banco da API de transporte
-- Dialeto: MySQL

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS localizacao;
DROP TABLE IF EXISTS horarios;
DROP TABLE IF EXISTS avaliacao;
DROP TABLE IF EXISTS motoristas_rotas;
DROP TABLE IF EXISTS rota_onibus;
DROP TABLE IF EXISTS pontos;
DROP TABLE IF EXISTS rotas;
DROP TABLE IF EXISTS manutencao;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS onibus;
DROP TABLE IF EXISTS motorista;
DROP TABLE IF EXISTS linhas;
DROP TABLE IF EXISTS tipo_usuarios;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE tipo_usuarios (
    id_tipo_usuario TINYINT PRIMARY KEY AUTO_INCREMENT,
    nome_tipo_usuario VARCHAR(20) NOT NULL
);

CREATE TABLE motorista (
    id_motorista INT PRIMARY KEY,
    nome_motorista VARCHAR(100) NOT NULL,
    cpf_motorista BIGINT NOT NULL,
    cnh_motorista BIGINT NOT NULL,
    foto_motorista VARCHAR(255)
);

CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    id_tipo_usuario TINYINT NOT NULL,
    id_motorista INT NULL,
    nome_usuario VARCHAR(80) NOT NULL,
    senha_usuario VARCHAR(128) NOT NULL,
    CONSTRAINT uk_usuarios_id_motorista UNIQUE (id_motorista),
    CONSTRAINT fk_usuarios_tipo_usuario
        FOREIGN KEY (id_tipo_usuario)
        REFERENCES tipo_usuarios(id_tipo_usuario),
    CONSTRAINT fk_usuarios_motorista
        FOREIGN KEY (id_motorista)
        REFERENCES motorista(id_motorista)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE onibus (
    id_onibus SMALLINT PRIMARY KEY AUTO_INCREMENT,
    placa_onibus VARCHAR(8) NOT NULL,
    modelo_onibus VARCHAR(30) NOT NULL,
    tipo_combustivel_onibus TINYINT NOT NULL,
    ano_onibus SMALLINT
);

CREATE TABLE manutencao (
    id_manutencao INT PRIMARY KEY AUTO_INCREMENT,
    id_onibus SMALLINT NOT NULL,
    descricao_manutencao VARCHAR(255) NOT NULL,
    data_inicio_manutencao DATE NOT NULL,
    data_fim_manutencao DATE,
    status_manutencao TINYINT NOT NULL,
    CONSTRAINT fk_manutencao_onibus
        FOREIGN KEY (id_onibus)
        REFERENCES onibus(id_onibus)
);

CREATE TABLE linhas (
    id_linha SMALLINT PRIMARY KEY AUTO_INCREMENT,
    nome_linhas VARCHAR(30) NOT NULL
);

CREATE TABLE rotas (
    id_rota MEDIUMINT PRIMARY KEY,
    id_linha SMALLINT NOT NULL,
    mapa TEXT,
    cor VARCHAR(7) NOT NULL DEFAULT '#6B7280',
    trajeto LONGTEXT,
    CONSTRAINT fk_rotas_linha
        FOREIGN KEY (id_linha)
        REFERENCES linhas(id_linha)
);

CREATE TABLE pontos (
    id_pontos SMALLINT PRIMARY KEY AUTO_INCREMENT,
    nome_pontos VARCHAR(100) NOT NULL,
    latitude_pontos DECIMAL(11,8) NOT NULL,
    longitude_pontos DECIMAL(11,8) NOT NULL,
    id_rota MEDIUMINT NOT NULL,
    CONSTRAINT fk_pontos_rota
        FOREIGN KEY (id_rota)
        REFERENCES rotas(id_rota)
);

CREATE TABLE rota_onibus (
    id_rotaOnibus MEDIUMINT PRIMARY KEY AUTO_INCREMENT,
    id_motorista INT NOT NULL,
    id_onibus SMALLINT NOT NULL,
    id_rota MEDIUMINT NOT NULL,
    data_ocorrencia_rota_onibus DATE,
    CONSTRAINT fk_rota_onibus_motorista
        FOREIGN KEY (id_motorista)
        REFERENCES motorista(id_motorista),
    CONSTRAINT fk_rota_onibus_onibus
        FOREIGN KEY (id_onibus)
        REFERENCES onibus(id_onibus),
    CONSTRAINT fk_rota_onibus_rota
        FOREIGN KEY (id_rota)
        REFERENCES rotas(id_rota)
);

CREATE TABLE motoristas_rotas (
    id_motorista_rota INT PRIMARY KEY AUTO_INCREMENT,
    id_motorista INT NOT NULL,
    id_rota MEDIUMINT NOT NULL,
    CONSTRAINT uk_motoristas_rotas UNIQUE (id_motorista, id_rota),
    CONSTRAINT fk_motoristas_rotas_motorista
        FOREIGN KEY (id_motorista)
        REFERENCES motorista(id_motorista)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_motoristas_rotas_rota
        FOREIGN KEY (id_rota)
        REFERENCES rotas(id_rota)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE localizacao (
    id_localizacao INT PRIMARY KEY AUTO_INCREMENT,
    id_rota_onibus MEDIUMINT NOT NULL,
    latitude_localizacao DECIMAL(11,8) NOT NULL,
    longitude_localizacao DECIMAL(11,8) NOT NULL,
    data_hora_localizacao DATETIME NOT NULL,
    CONSTRAINT fk_localizacao_rota_onibus
        FOREIGN KEY (id_rota_onibus)
        REFERENCES rota_onibus(id_rotaOnibus)
);

CREATE TABLE avaliacao (
    id_avaliacao INT PRIMARY KEY AUTO_INCREMENT,
    id_motorista INT NOT NULL,
    nota_avaliacao TINYINT NOT NULL,
    comentario_avaliacao VARCHAR(255),
    data_avaliacao DATETIME NOT NULL,
    CONSTRAINT fk_avaliacao_motorista
        FOREIGN KEY (id_motorista)
        REFERENCES motorista(id_motorista)
);

CREATE TABLE horarios (
    id_horario MEDIUMINT PRIMARY KEY AUTO_INCREMENT,
    id_ponto SMALLINT NOT NULL,
    passagem_horarios TIME NOT NULL,
    CONSTRAINT fk_horarios_ponto
        FOREIGN KEY (id_ponto)
        REFERENCES pontos(id_pontos)
);

INSERT INTO tipo_usuarios (id_tipo_usuario, nome_tipo_usuario) VALUES
(1, 'Administrador'),
(2, 'Motorista');

INSERT INTO motorista (id_motorista, nome_motorista, cpf_motorista, cnh_motorista, foto_motorista) VALUES
(1, 'Roberval', 12345678901, 98765432101, 'fotos/motoristas/1.jpg'),
(2, 'Zenaldo', 23456789012, 87654321012, 'fotos/motoristas/2.jpg'),
(3, 'Bruno', 34567890123, 76543210123, 'fotos/motoristas/3.jpg'),
(4, 'Andre', 45678901234, 65432101234, 'fotos/motoristas/4.jpg'),
(5, 'Carlos', 56789012345, 54321012345, 'fotos/motoristas/5.jpg'),
(6, 'Pedro', 67890123456, 43210123456, 'fotos/motoristas/6.jpg');

INSERT INTO usuarios (id_tipo_usuario, id_motorista, nome_usuario, senha_usuario) VALUES
(1, NULL, 'Administrador', '123456'),
(2, 1, 'Roberval', '123456'),
(2, 2, 'Zenaldo', '123456'),
(2, 3, 'Bruno', '123456'),
(2, 4, 'Andre', '123456');

INSERT INTO onibus (id_onibus, placa_onibus, modelo_onibus, tipo_combustivel_onibus, ano_onibus) VALUES
(1, 'ABC1D23', 'Mercedes O500', 0, 2015),
(2, 'DEF2E45', 'Volvo B8R', 1, 2018),
(3, 'GHI3F67', 'CAIO Millennium', 0, 2012),
(4, 'JKL4G89', 'Marcopolo Torino', 3, 2021),
(5, 'MNO5H01', 'Volare W9', 1, 2017),
(6, 'PQR6I23', 'Mercedes OF-1721', 0, 2014);

INSERT INTO linhas (id_linha, nome_linhas) VALUES
(1, 'ROXA'),
(2, 'AZUL'),
(3, 'LARANJA'),
(4, 'AMARELA');

INSERT INTO rotas (id_rota, id_linha, mapa, cor, trajeto) VALUES
(1, 1, NULL, '#7C3AED', NULL),
(2, 2, NULL, '#2563EB', NULL),
(3, 3, NULL, '#EA580C', NULL),
(4, 4, NULL, '#EAB308', NULL);

INSERT INTO pontos (id_pontos, nome_pontos, latitude_pontos, longitude_pontos, id_rota) VALUES
(1, 'Terminal Central', -23.55052000, -46.63330800, 1),
(2, 'Avenida Principal', -23.54890000, -46.63400000, 1),
(3, 'Praca Norte', -23.56141400, -46.65588100, 2),
(4, 'Terminal Norte', -23.50000000, -46.60000000, 2),
(5, 'Praca das Flores', -23.57000000, -46.64000000, 3),
(6, 'Terminal Sul', -23.60000000, -46.65000000, 4);

INSERT INTO horarios (id_ponto, passagem_horarios) VALUES
(1, '06:00:00'),
(1, '07:00:00'),
(2, '06:30:00'),
(3, '08:00:00'),
(4, '09:15:00'),
(5, '17:45:00');

INSERT INTO manutencao (id_onibus, descricao_manutencao, data_inicio_manutencao, data_fim_manutencao, status_manutencao) VALUES
(1, 'Troca de oleo e filtros', '2025-09-10', '2025-09-12', 2),
(2, 'Reparo no sistema de freios', '2025-10-01', NULL, 1),
(3, 'Substituicao de pneus', '2025-08-05', '2025-08-06', 2),
(4, 'Verificacao eletrica', '2025-10-02', NULL, 1),
(5, 'Revisao geral', '2025-07-15', '2025-07-20', 2),
(6, 'Correcao de vazamento', '2025-10-05', NULL, 0);

INSERT INTO rota_onibus (id_motorista, id_onibus, id_rota, data_ocorrencia_rota_onibus) VALUES
(1, 1, 1, '2025-10-01'),
(2, 2, 2, '2025-10-02'),
(3, 3, 3, '2025-10-03'),
(4, 4, 4, '2025-10-04'),
(5, 5, 1, '2025-10-05'),
(6, 6, 2, '2025-10-06');

INSERT INTO motoristas_rotas (id_motorista, id_rota) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 1),
(6, 2);

INSERT INTO localizacao (id_rota_onibus, latitude_localizacao, longitude_localizacao, data_hora_localizacao) VALUES
(1, -23.55052000, -46.63330800, '2025-10-07 08:15:00'),
(1, -23.54890000, -46.63400000, '2025-10-07 08:20:00'),
(2, -23.56141400, -46.65588100, '2025-10-07 09:30:00'),
(3, -23.50000000, -46.60000000, '2025-10-07 10:00:00'),
(4, -23.57000000, -46.64000000, '2025-10-07 11:45:00'),
(5, -23.60000000, -46.65000000, '2025-10-07 12:10:00');

INSERT INTO avaliacao (id_motorista, nota_avaliacao, comentario_avaliacao, data_avaliacao) VALUES
(1, 5, 'Motorista muito atencioso e direcao segura.', '2025-09-30 14:20:00'),
(2, 4, 'Onibus limpo, porem atrasou 10 minutos.', '2025-09-28 09:10:00'),
(3, 5, 'Viagem excelente, prestou informacoes.', '2025-09-25 18:05:00'),
(4, 3, 'Atendimento razoavel, poderia melhorar.', '2025-10-03 07:50:00'),
(5, 4, 'Boa viagem, motorista educado.', '2025-10-04 13:30:00'),
(6, 2, 'Veiculo com cheiro forte de combustivel.', '2025-10-06 16:00:00');
