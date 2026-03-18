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
select * from tipo_usuarios;
select * from usuarios;

SELECT COUNT(*) AS id_motorista 
FROM motorista; /*numero total de motoristas*/

SELECT nome_usuario, ISNULL(email_usuario) AS EmailCorrigido 
FROM usuarios; /* substitui campos nulos de email com "Sem Email". */

SELECT nome_usuario, telefone_usuario
FROM usuarios
WHERE telefone_usuario IS NULL; /*Filtra os clientes que ainda não têm email cadastrado.*/
