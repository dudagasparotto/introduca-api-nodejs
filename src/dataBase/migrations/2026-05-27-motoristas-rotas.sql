CREATE TABLE IF NOT EXISTS motoristas_rotas (
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

INSERT IGNORE INTO motoristas_rotas (id_motorista, id_rota)
SELECT DISTINCT id_motorista, id_rota
FROM rota_onibus
WHERE id_motorista IS NOT NULL
  AND id_rota IS NOT NULL;

INSERT IGNORE INTO motoristas_rotas (id_motorista, id_rota)
SELECT id_motorista, rota_motorista
FROM motorista
WHERE rota_motorista IS NOT NULL;
