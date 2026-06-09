ALTER TABLE usuarios
    ADD COLUMN id_motorista INT NULL AFTER id_tipo_usuario;

UPDATE usuarios AS u
INNER JOIN motorista AS m
    ON m.id_motorista = u.id_usuario
SET u.id_motorista = m.id_motorista
WHERE u.id_tipo_usuario = 2
  AND u.id_motorista IS NULL;

ALTER TABLE usuarios
    ADD CONSTRAINT uk_usuarios_id_motorista UNIQUE (id_motorista),
    ADD CONSTRAINT fk_usuarios_motorista
        FOREIGN KEY (id_motorista)
        REFERENCES motorista(id_motorista)
        ON UPDATE CASCADE
        ON DELETE CASCADE;
