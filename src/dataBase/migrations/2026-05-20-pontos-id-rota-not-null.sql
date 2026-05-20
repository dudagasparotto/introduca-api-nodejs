UPDATE pontos p
JOIN (
  SELECT
    id_pontos,
    ROW_NUMBER() OVER (ORDER BY id_pontos) AS ordem
  FROM pontos
  WHERE id_rota IS NULL
) pendentes ON pendentes.id_pontos = p.id_pontos
JOIN (
  SELECT
    id_rota,
    ROW_NUMBER() OVER (ORDER BY id_rota) AS ordem,
    COUNT(*) OVER () AS total
  FROM rotas
) rotas_disponiveis
  ON rotas_disponiveis.ordem = MOD(pendentes.ordem - 1, rotas_disponiveis.total) + 1
SET p.id_rota = rotas_disponiveis.id_rota;

ALTER TABLE pontos
  MODIFY COLUMN id_rota MEDIUMINT NOT NULL;
