select * from linhas;
select * from avaliacao;
select * from horarios;
select * from localizacao;
select * from manutencao;
select * from motorista;
select * from onibus;
select * from pontos;
select * from rota_onibus;
select * from rotas;
select * from tipo_usuarios; /*apagar essa tabela*/
select * from usuarios;

SELECT COUNT(*) AS id_motorista 
FROM motorista; /*numero total de motoristas*/

UPDATE rotas 
SET coluna1 = 'novo_valor' 
WHERE id = 1; 

ALTER TABLE motorista
MODIFY cpf_motorista VARCHAR(20);

ALTER TABLE avaliacao
DROP FOREIGN KEY avaliacao_ibfk_1;

