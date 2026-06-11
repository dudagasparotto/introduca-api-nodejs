ALTER TABLE rotas
    ADD COLUMN cor VARCHAR(7) NOT NULL DEFAULT '#6B7280' AFTER mapa;

ALTER TABLE rotas
    ADD COLUMN trajeto LONGTEXT NULL AFTER cor;

UPDATE rotas SET cor = '#7C3AED' WHERE id_rota = 1;
UPDATE rotas SET cor = '#2563EB' WHERE id_rota = 2;
UPDATE rotas SET cor = '#EA580C' WHERE id_rota = 3;
UPDATE rotas SET cor = '#EAB308' WHERE id_rota = 4;
