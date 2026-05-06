const express = require('express');
const router = express.Router();
const Atividade = require('../models/Atividade');

/**
 * @swagger
 * /api/solicitacoes:
 *   get:
 *     summary: Lista todas as solicitações
 *     tags: [Solicitações]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pendente, aprovado, rejeitado]
 *         description: Filtrar por status
 *     responses:
 *       200:
 *         description: Lista de solicitações retornada com sucesso
 */
router.get('/', async (req, res) => {
  try {
    const filtro = {};

    if (req.query.status && req.query.status !== 'todos') {
      filtro.status = req.query.status;
    }

    const atividades = await Atividade.find(filtro)
      .populate('idAluno', 'nome email matricula')
      .populate('idCurso', 'nome')
      .populate('idCategoria', 'nome');

    res.json(atividades);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar solicitações', detalhe: error.message });
  }
});

/**
 * @swagger
 * /api/solicitacoes/{id}:
 *   get:
 *     summary: Busca uma solicitação pelo ID
 *     tags: [Solicitações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Solicitação encontrada
 *       404:
 *         description: Solicitação não encontrada
 */
router.get('/:id', async (req, res) => {
  try {
    const atividade = await Atividade.findById(req.params.id)
      .populate('idAluno', 'nome email matricula')
      .populate('idCurso', 'nome')
      .populate('idCategoria', 'nome');

    if (!atividade) {
      return res.status(404).json({ erro: 'Solicitação não encontrada' });
    }

    res.json(atividade);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar solicitação', detalhe: error.message });
  }
});

/**
 * @swagger
 * /api/solicitacoes/aluno/{idAluno}:
 *   get:
 *     summary: Lista solicitações de um aluno específico
 *     tags: [Solicitações]
 *     parameters:
 *       - in: path
 *         name: idAluno
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Solicitações do aluno retornadas com sucesso
 */
router.get('/aluno/:idAluno', async (req, res) => {
  try {
    const atividades = await Atividade.find({ idAluno: req.params.idAluno })
      .populate('idCurso', 'nome')
      .populate('idCategoria', 'nome');

    res.json(atividades);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar solicitações do aluno', detalhe: error.message });
  }
});

/**
 * @swagger
 * /api/solicitacoes:
 *   post:
 *     summary: Envia uma nova solicitação de atividade complementar
 *     tags: [Solicitações]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - cargaHoraria
 *               - idAluno
 *               - idCurso
 *               - idCategoria
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Participação em congresso de TI
 *               descricao:
 *                 type: string
 *                 example: Congresso realizado em Recife, 3 dias de evento
 *               cargaHoraria:
 *                 type: number
 *                 example: 20
 *               idAluno:
 *                 type: string
 *                 example: "664f1a2b3c4d5e6f7a8b9c0d"
 *               idCurso:
 *                 type: string
 *                 example: "664f1a2b3c4d5e6f7a8b9c0e"
 *               idCategoria:
 *                 type: string
 *                 example: "664f1a2b3c4d5e6f7a8b9c0f"
 *     responses:
 *       201:
 *         description: Solicitação criada com sucesso
 */
router.post('/', async (req, res) => {
  try {
    const { titulo, descricao, cargaHoraria, idAluno, idCurso, idCategoria } = req.body;

    if (!titulo || !cargaHoraria || !idAluno || !idCurso || !idCategoria) {
      return res.status(400).json({ erro: 'Título, carga horária, aluno, curso e categoria são obrigatórios' });
    }

    const atividade = new Atividade({
      titulo,
      descricao,
      cargaHoraria,
      idAluno,
      idCurso,
      idCategoria,
      status: 'pendente',
      dataEnvio: new Date()
    });

    await atividade.save();

    res.status(201).json(atividade);
  } catch (error) {
    console.error('ERRO SOLICITACAO:', error);
res.status(500).json({ erro: 'Erro ao criar solicitação', detalhe: error.message });
  }
});

/**
 * @swagger
 * /api/solicitacoes/{id}/aprovar:
 *   put:
 *     summary: Aprova uma solicitação
 *     tags: [Solicitações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idCoordenador:
 *                 type: string
 *                 example: "664f1a2b3c4d5e6f7a8b9c0a"
 *               cargaHorariaValidada:
 *                 type: number
 *                 example: 20
 *     responses:
 *       200:
 *         description: Solicitação aprovada com sucesso
 *       404:
 *         description: Solicitação não encontrada
 */
router.put('/:id/aprovar', async (req, res) => {
  try {
    const { idCoordenador, cargaHorariaValidada } = req.body;

    const atividade = await Atividade.findByIdAndUpdate(
      req.params.id,
      {
        status: 'aprovado',
        'avaliacao.cargaHorariaValidada': cargaHorariaValidada || 0,
        'avaliacao.dataAvaliacao': new Date(),
        'avaliacao.idCoordenador': idCoordenador || null
      },
      { new: true }
    );

    if (!atividade) {
      return res.status(404).json({ erro: 'Solicitação não encontrada' });
    }

    res.json(atividade);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao aprovar solicitação', detalhe: error.message });
  }
});

/**
 * @swagger
 * /api/solicitacoes/{id}/rejeitar:
 *   put:
 *     summary: Rejeita uma solicitação
 *     tags: [Solicitações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               observacao:
 *                 type: string
 *                 example: Documentação insuficiente
 *               idCoordenador:
 *                 type: string
 *                 example: "664f1a2b3c4d5e6f7a8b9c0a"
 *     responses:
 *       200:
 *         description: Solicitação rejeitada com sucesso
 *       404:
 *         description: Solicitação não encontrada
 */
router.put('/:id/rejeitar', async (req, res) => {
  try {
    const { observacao, idCoordenador } = req.body || {};

    const atividade = await Atividade.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejeitado',
        'avaliacao.observacao': observacao || null,
        'avaliacao.dataAvaliacao': new Date(),
        'avaliacao.idCoordenador': idCoordenador || null
      },
      { new: true }
    );

    if (!atividade) {
      return res.status(404).json({ erro: 'Solicitação não encontrada' });
    }

    res.json(atividade);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao rejeitar solicitação', detalhe: error.message });
  }
});

module.exports = router;
