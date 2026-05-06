require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

// ==================== MIDDLEWARES ====================
app.use(cors());
app.use(express.json());

// ==================== SWAGGER ====================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'API - Atividades Complementares'
}));

// ==================== ROTAS ====================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/alunos', require('./routes/alunos'));
app.use('/api/coordenadores', require('./routes/coordenadores'));
app.use('/api/cursos', require('./routes/cursos'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/solicitacoes', require('./routes/solicitacoes'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', mensagem: 'API funcionando!' });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({ mensagem: 'API de Atividades Complementares - Acesse /api-docs para a documentação' });
});

// ==================== CONEXÃO COM MONGODB ====================
const MONGO_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Conectado ao MongoDB Atlas com sucesso!');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📄 Documentação disponível em http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  });
