const db = require('../dataBase/connection');

module.exports = {
  async listar(request, response) {
    try {
      const [dados] = await db.query(`
        SELECT id_motorista_rota, id_motorista, id_rota
        FROM motoristas_rotas
        ORDER BY id_motorista, id_rota
      `);

      return response.status(200).json({
        sucesso: true,
        mensagem: 'Vínculos de motoristas e rotas obtidos com sucesso.',
        itens: dados.length,
        dados,
      });
    } catch (error) {
      return response.status(500).json({
        sucesso: false,
        mensagem: `Erro ao listar vínculos: ${error.message}`,
        dados: null,
      });
    }
  },

  async listarPorMotorista(request, response) {
    try {
      const [rotas] = await db.query(
        `SELECT id_motorista_rota, id_motorista, id_rota
         FROM motoristas_rotas
         WHERE id_motorista = ?
         ORDER BY id_rota`,
        [request.params.id]
      );

      return response.status(200).json({
        sucesso: true,
        dados: { rotas },
      });
    } catch (error) {
      return response.status(500).json({
        sucesso: false,
        mensagem: `Erro ao listar rotas do motorista: ${error.message}`,
        dados: null,
      });
    }
  },

  async substituir(request, response) {
    const conexao = await db.getConnection();

    try {
      const idMotorista = Number(request.params.id);
      const idsRotas = [
        ...new Set((request.body.ids_rotas || []).map(Number)),
      ].filter((id) => Number.isInteger(id) && id > 0);

      await conexao.beginTransaction();
      await conexao.query(
        'DELETE FROM motoristas_rotas WHERE id_motorista = ?',
        [idMotorista]
      );

      for (const idRota of idsRotas) {
        await conexao.query(
          `INSERT INTO motoristas_rotas (id_motorista, id_rota)
           VALUES (?, ?)`,
          [idMotorista, idRota]
        );
      }

      await conexao.commit();
      return response.status(200).json({
        sucesso: true,
        mensagem: 'Rotas do motorista atualizadas com sucesso.',
        dados: { id_motorista: idMotorista, ids_rotas: idsRotas },
      });
    } catch (error) {
      await conexao.rollback();
      return response.status(500).json({
        sucesso: false,
        mensagem: `Erro ao atualizar rotas do motorista: ${error.message}`,
        dados: null,
      });
    } finally {
      conexao.release();
    }
  },
};
