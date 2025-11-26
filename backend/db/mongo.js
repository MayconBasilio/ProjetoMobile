const mongoose = require('mongoose');

// Schema do aluno para MongoDB
const alunoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    minlength: 3
  },
  telefone: {
    type: String,
    required: true
  },
  dataNascimento: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  }
}, {
  timestamps: true
});

const Aluno = mongoose.model('Aluno', alunoSchema);

// Função para conectar ao MongoDB
const connectMongo = async () => {
  try {
    // String de conexão do MongoDB
    const mongoUri = 'mongodb://localhost:27017/alunos_db';
    await mongoose.connect(mongoUri);
    console.log('Conectado ao MongoDB com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    throw error;
  }
};

module.exports = { Aluno, connectMongo };

