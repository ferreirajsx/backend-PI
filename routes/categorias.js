const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria');

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Lista todas as categorias de atividades
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
 */
router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar categorias', detalhe: error.message });
  }
});

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Busca uma categoria pelo ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *       404:
 *         description: Categoria não encontrada
 */
router.get('/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);

    if (!categoria) {
      return res.status(404).json({ erro: 'Categoria não encontrada' });
    }

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar categoria', detalhe: error.message });
  }
});

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Categorias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Extensão Universitária
 *               descricao:
 *                 type: string
 *                 example: Atividades de extensão realizadas na comunidade
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 */
router.post('/', async (req, res) => {
  try {
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: 'Nome da categoria é obrigatório' });
    }

    const categoria = new Categoria({ nome, descricao });
    await categoria.save();

    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar categoria', detalhe: error.message });
  }
});

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Remove uma categoria
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria removida com sucesso
 *       404:
 *         description: Categoria não encontrada
 */
router.delete('/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);

    if (!categoria) {
      return res.status(404).json({ erro: 'Categoria não encontrada' });
    }

    res.json({ mensagem: 'Categoria removida com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao remover categoria', detalhe: error.message });
  }
});

module.exports = router;
