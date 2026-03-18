-- Arquivo: inserts.sql
-- Dialeto: MySQL
-- Inserts de exemplo (6 linhas por tabela) – dados realistas e consistentes com chaves estrangeiras

-- Observação: ajuste ids/autoincrement conforme necessário ao executar

-- Tipo de usuários (6 registros)
INSERT INTO tipo_usuarios (id_tipo_usuario, nome_tipo_usuario) VALUES
(1, 'Administrador'),
(2, 'Motorista'),
(3, 'Usuário'),
(4, 'Supervisor'),
(5, 'Operador'),
(6, 'Convidado');

-- Usuários (6 registros)
INSERT INTO usuario (id_tipo_usuario, nome_usuario, email_usuario, senha_usuario, telefone_usuario) VALUES
(1, 'Mariana Silva', 'mariana.silva@example.com', 'senha_hash_1', '+5511999887766'),
(3, 'Carlos Pereira', 'carlos.pereira@example.com', 'senha_hash_2', '+5511987766554'),
(2, 'João Motorista', 'joao.motorista@example.com', 'senha_hash_3', '+5511976655443'),
(4, 'Ana Supervisora', 'ana.supervisora@example.com', 'senha_hash_4', '+5511965544332'),
(5, 'Lucas Operador', 'lucas.operador@example.com', 'senha_hash_5', '+5511954433221'),
(6, 'Visitante', 'visitante@example.com', 'senha_hash_6', NULL);

-- Motoristas (6 registros) - ids definidos explicitamente
INSERT INTO motorista (id_motorista, cpf_motorista, cnh_motorista, foto_motorista) VALUES
(1, 12345678901, 98765432101, 'fotos/motoristas/1.jpg'),
(2, 23456789012, 87654321012, 'fotos/motoristas/2.jpg'),
(3, 34567890123, 76543210123, 'fotos/motoristas/3.jpg'),
(4, 45678901234, 65432101234, 'fotos/motoristas/4.jpg'),
(5, 56789012345, 54321012345, 'fotos/motoristas/5.jpg'),
(6, 67890123456, 43210123456, 'fotos/motoristas/6.jpg');

-- Ônibus (6 registros)
INSERT INTO onibus (placa_onibus, modelo_onibus, tipo_combustivel_onibus, ano_onibus) VALUES
('ABC1D23', 'Mercedes O500', 0, 2015),
('DEF2E45', 'Volvo B8R', 1, 2018),
('GHI3F67', 'CAIO Millennium', 0, 2012),
('JKL4G89', 'Marcopolo Torino', 3, 2021),
('MNO5H01', 'Volare W9', 1, 2017),
('PQR6I23', 'Mercedes OF-1721', 0, 2014);

-- Linhas (6 registros)
INSERT INTO linhas (nome_linhas, descricao_linha) VALUES
('Linha 1 - Centro', 'Percurso: Terminal A - Terminal B'),
('Linha 2 - Norte', 'Percurso: Terminal C - Terminal D'),
('Linha 3 - Sul', 'Percurso: Terminal E - Terminal F'),
('Linha 4 - Leste', 'Percurso circular pela zona leste'),
('Linha 5 - Oeste', 'Atende bairros residenciais'),
('Linha 6 - Expresso', 'Trajeto expresso com poucos pontos');

-- Pontos (6 registros) - coordenadas fictícias (ex.: cidade exemplo)
INSERT INTO pontos (nome_pontos, latitude_pontos, longitude_pontos) VALUES
('Ponto Central', -23.55052000, -46.63330800),
('Terminal A', -23.54890000, -46.63400000),
('Avenida Paulista', -23.56141400, -46.65588100),
('Estação Norte', -23.50000000, -46.60000000),
('Praça das Flores', -23.57000000, -46.64000000),
('Terminal Sul', -23.60000000, -46.65000000);

-- Rotas (6 registros) -> cada rota referencia um ponto e uma linha
INSERT INTO rotas (id_ponto, id_linha, ordem_sequencia_rotas) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 1),
(4, 2, 2),
(5, 3, 1),
(6, 6, 1);

-- Horários (6 registros) -> referência a pontos
INSERT INTO horarios (id_ponto, passagem_horarios) VALUES
(1, '06:00:00'),
(1, '07:00:00'),
(2, '06:30:00'),
(3, '08:00:00'),
(4, '09:15:00'),
(5, '17:45:00');

-- Manutenções (6 registros) -> referenciam ônibus
INSERT INTO manutencao (id_onibus, descricao_manutencao, data_inicio_manutencao, data_fim_manutencao, status_manutencao) VALUES
(1, 'Troca de óleo e filtros', '2025-09-10', '2025-09-12', 2),
(2, 'Reparo no sistema de freios', '2025-10-01', NULL, 1),
(3, 'Substituição de pneus', '2025-08-05', '2025-08-06', 2),
(4, 'Verificação elétrica', '2025-10-02', NULL, 1),
(5, 'Revisão geral', '2025-07-15', '2025-07-20', 2),
(6, 'Correção de vazamento', '2025-10-05', NULL, 0);

-- Rota_onibus (6 registros) -> relaciona motorista, onibus e rota
INSERT INTO rota_onibus (id_motorista, id_onibus, id_rota, data_ocorrencia_rota_onibus) VALUES
(1, 1, 1, '2025-10-01'),
(2, 2, 2, '2025-10-02'),
(3, 3, 3, '2025-10-03'),
(4, 4, 4, '2025-10-04'),
(5, 5, 5, '2025-10-05'),
(6, 6, 6, '2025-10-06');

-- Localizações (6 registros) -> referência rota_onibus
INSERT INTO localizacao (id_rota_onibus, latitude_localizacao, longitude_localizacao, data_hora_localizacao) VALUES
(1, -23.55052000, -46.63330800, '2025-10-07 08:15:00'),
(1, -23.54890000, -46.63400000, '2025-10-07 08:20:00'),
(2, -23.56141400, -46.65588100, '2025-10-07 09:30:00'),
(3, -23.50000000, -46.60000000, '2025-10-07 10:00:00'),
(4, -23.57000000, -46.64000000, '2025-10-07 11:45:00'),
(5, -23.60000000, -46.65000000, '2025-10-07 12:10:00');

-- Avaliações (6 registros) -> referência usuario e motorista
INSERT INTO avaliacao (id_usuario, id_motorista, nota_avaliacao, comentario_avaliacao, data_avaliacao) VALUES
(2, 1, 5, 'Motorista muito atencioso e direção segura.', '2025-09-30 14:20:00'),
(3, 2, 4, 'Ônibus limpo, porém atrasou 10 minutos.', '2025-09-28 09:10:00'),
(1, 3, 5, 'Viagem excelente, prestou informações.', '2025-09-25 18:05:00'),
(5, 4, 3, 'Atendimento razoável, poderia melhorar.', '2025-10-03 07:50:00'),
(6, 5, 4, 'Boa viagem, motorista educado.', '2025-10-04 13:30:00'),
(2, 6, 2, 'Veículo com cheiro forte de combustível.', '2025-10-06 16:00:00');

-- Fim do arquivo inserts.sql
