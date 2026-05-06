const express = require('express');
const router = express.Router();
const Curso = require('../models/Curso');

/**
 * @swagger
 * /api/cursos:
 *   get:
 *     summary: Lista todos os cursos
 *     tags: [Cursos]
 *     responses:
 *       200:
 *         description: Lista de cursos retornada com sucesso
 */
router.get('/', async (req, res) => {
  try {
    const cursos = await Curso.find();
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar cursos', detalhe: error.message });
  }
});

/**
 * @swagger
 * /api/cursos/{id}:
 *   get:
 *     summary: Busca um curso pelo ID
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Curso encontrado
 *       404:
 *         description: Curso não encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id);

    if (!curso) {
      return res.status(404).json({ erro: 'Curso não encontrado' });
    }

    res.json(curso);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar curso', detalhe: error.message });
  }
});

/**
 * @swagger
 * /api/cursos:
 *   post:
 *     summary: Cria um novo curso
 *     tags: [Cursos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - cargaHorariaTotal
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Ciência da Computação
 *               cargaHorariaTotal:
 *                 type: number
 *                 example: 200
 *               regra:
 *                 type: object
 *                 properties:
 *                   cargaHorariaMin:
 *                     type: number
 *                     example: 10
 *                   cargaHorariaMax:
 *                     type: number
 *                     example: 60
 *     responses:
 *       201:
 *         description: Curso criado com sucesso
 */
router.post('/', async (req, res) => {
  try {
    const { nome, cargaHorariaTotal, regra } = req.body;

    if (!nome || !cargaHorariaTotal) {
      return res.status(400).json({ erro: 'Nome e carga horária total são obrigatórios' });
    }

    const curso = new Curso({ nome, cargaHorariaTotal, regra });
    await curso.save();

    res.status(201).json(curso);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar curso', detalhe: error.message });
  }
});

/**
 * @swagger
 * /api/cursos/{id}:
 *   put:
 *     summary: Atualiza um curso
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               cargaHorariaTotal:
 *                 type: number
 *               regra:
 *                 type: object
 *     responses:
 *       200:
 *         description: Curso atualizado com sucesso
 *       404:
 *         description: Curso não encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const curso = await Curso.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!curso) {
      return res.status(404).json({ erro: 'Curso não encontrado' });
    }

    res.json(curso);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar curso', detalhe: error.message });
  }
});

/**
 * @swagger
 * /api/cursos/{id}:
 *   delete:
 *     summary: Remove um curso
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Curso removido com sucesso
 *       404:
 *         description: Curso não encontrado
 */
router.delete('/:id', async (req, res) => {
  try {
    const curso = await Curso.findByIdAndDelete(req.params.id);

    if (!curso) {
      return res.status(404).json({ erro: 'Curso não encontrado' });
    }

    res.json({ mensagem: 'Curso removido com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao remover curso', detalhe: error.message });
  }
});

module.exports = router;
