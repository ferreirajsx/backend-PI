const express = require('express');
const router = express.Router();
const Atividade = require('../models/Atividade');
const Usuario = require('../models/Usuario');
const Curso = require('../models/Curso');

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Retorna métricas gerais do sistema
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Métricas retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPendentes:
 *                   type: number
 *                 totalAlunos:
 *                   type: number
 *                 totalCursos:
 *                   type: number
 *                 taxaAprovacao:
 *                   type: string
 *                   example: "75.00%"
 */
router.get('/', async (req, res) => {
  try {
    const totalPendentes = await Atividade.countDocuments({ status: 'pendente' });
    const totalAlunos = await Usuario.countDocuments({ perfil: 'aluno' });
    const totalCursos = await Curso.countDocuments();

    const totalAvaliadas = await Atividade.countDocuments({ status: { $in: ['aprovado', 'rejeitado'] } });
    const totalAprovadas = await Atividade.countDocuments({ status: 'aprovado' });

    const taxaAprovacao = totalAvaliadas > 0
      ? ((totalAprovadas / totalAvaliadas) * 100).toFixed(2) + '%'
      : '0%';

    res.json({
      totalPendentes,
      totalAlunos,
      totalCursos,
      taxaAprovacao
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar métricas', detalhe: error.message });
  }
});

module.exports = router;
