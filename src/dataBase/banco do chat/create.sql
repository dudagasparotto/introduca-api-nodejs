-- Script de criação das tabelas do sistema de transporte
-- Dialeto: MySQL

CREATE TABLE tipo_usuarios (
    id_tipo_usuario TINYINT PRIMARY KEY AUTO_INCREMENT,
    nome_tipo_usuario VARCHAR(20) NOT NULL
    -- 0 – Administrador, 1 – Motorista, 2 - Usuário
);

CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    id_tipo_usuario TINYINT NOT NULL,
    nome_usuario VARCHAR(80) NOT NULL,
    email_usuario VARCHAR(60) NOT NULL,
    senha_usuario VARCHAR(128) NOT NULL,
    telefone_usuario VARCHAR(15),
    FOREIGN KEY (id_tipo_usuario) REFERENCES tipo_usuarios(id_tipo_usuario)
);

CREATE TABLE motorista (
    id_motorista INT PRIMARY KEY,
    cpf_motorista BIGINT NOT NULL,
    cnh_motorista BIGINT NOT NULL,
    foto_motorista VARCHAR(255)
);

CREATE TABLE onibus (
    id_onibus SMALLINT PRIMARY KEY AUTO_INCREMENT,
    placa_onibus VARCHAR(8) NOT NULL,
    modelo_onibus VARCHAR(12) NOT NULL,
    tipo_combustivel_onibus TINYINT NOT NULL,
    ano_onibus SMALLINT
    -- 0 – Diesel, 1 – Biodiesel, 3 - Elétrico
);

CREATE TABLE manutencao (
    id_manutencao INT PRIMARY KEY AUTO_INCREMENT,
    id_onibus SMALLINT NOT NULL,
    descricao_manutencao VARCHAR(255) NOT NULL,
    data_inicio_manutencao DATE NOT NULL,
    data_fim_manutencao DATE,
    status_manutencao TINYINT NOT NULL,
    FOREIGN KEY (id_onibus) REFERENCES onibus(id_onibus)
    -- 0 – Ruim, 1 – Consertando, 2 – Consertado
);

CREATE TABLE linhas (
    id_linha SMALLINT PRIMARY KEY AUTO_INCREMENT,
    nome_linhas VARCHAR(30) NOT NULL,
    descricao_linha VARCHAR(255)
);

CREATE TABLE pontos (
    id_pontos SMALLINT PRIMARY KEY AUTO_INCREMENT,
    nome_pontos VARCHAR(100) NOT NULL,
    latitude_pontos DECIMAL(11,8) NOT NULL,
    longitude_pontos DECIMAL(11,8) NOT NULL
);

CREATE TABLE rotas (
    id_rota MEDIUMINT PRIMARY KEY AUTO_INCREMENT,
    id_ponto SMALLINT NOT NULL,
    id_linha SMALLINT NOT NULL,
    ordem_sequencia_rotas TINYINT,
    FOREIGN KEY (id_ponto) REFERENCES pontos(id_pontos),
    FOREIGN KEY (id_linha) REFERENCES linhas(id_linha)
);

CREATE TABLE rota_onibus (
    id_rotaOnibus MEDIUMINT PRIMARY KEY AUTO_INCREMENT,
    id_motorista INT NOT NULL,
    id_onibus SMALLINT NOT NULL,
    id_rota MEDIUMINT NOT NULL,
    data_ocorrencia_rota_onibus DATE,
    FOREIGN KEY (id_motorista) REFERENCES motorista(id_motorista),
    FOREIGN KEY (id_onibus) REFERENCES onibus(id_onibus),
    FOREIGN KEY (id_rota) REFERENCES rotas(id_rota)
);

CREATE TABLE localizacao (
    id_localizacao INT PRIMARY KEY AUTO_INCREMENT,
    id_rota_onibus MEDIUMINT NOT NULL,
    latitude_localizacao DECIMAL(11,8) NOT NULL,
    longitude_localizacao DECIMAL(11,8) NOT NULL,
    data_hora_localizacao DATETIME NOT NULL,
    FOREIGN KEY (id_rota_onibus) REFERENCES rota_onibus(id_rotaOnibus)
);

CREATE TABLE avaliacao (
    id_avaliacao INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_motorista INT NOT NULL,
    nota_avaliacao TINYINT NOT NULL,
    comentario_avaliacao VARCHAR(255),
    data_avaliacao DATETIME NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_motorista) REFERENCES motorista(id_motorista)
);

CREATE TABLE horarios (
    id_horario MEDIUMINT PRIMARY KEY AUTO_INCREMENT,
    id_ponto SMALLINT NOT NULL,
    passagem_horarios TIME NOT NULL,
    FOREIGN KEY (id_ponto) REFERENCES pontos(id_pontos)
);
