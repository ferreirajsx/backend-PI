const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do curso é obrigatório'],
    trim: true
  },
  cargaHorariaTotal: {
    type: Number,
    required: [true, 'Carga horária total é obrigatória'],
    default: 0
  },
  // Regras do curso embutidas (em vez de tabela separada)
  regra: {
    cargaHorariaMin: { type: Number, default: 0 },
    cargaHorariaMax: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Curso', cursoSchema);
