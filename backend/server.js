require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectMongo } = require('./db/mongo');
const { sqliteController, mongoController } = require('./controllers/alunoController');
const createRoutes = require('./routes/alunos');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Variável para armazenar o tipo de banco selecionado na sessão
let currentDatabase = null;

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    mensagem: 'API de CRUD de Alunos',
    versao: '1.0.0',
    bancoAtual: currentDatabase || 'Nenhum banco selecionado'
  });
});

// Rota para selecionar o banco de dados
app.post('/select-db', async (req, res) => {
  console.log('📥 Recebendo requisição /select-db');
  console.log('Body:', req.body);
  
  const { database } = req.body;

  if (!database || (database !== 'sqlite' && database !== 'mongodb')) {
    console.log('❌ Banco inválido:', database);
    return res.status(400).json({ erro: 'Banco de dados inválido. Use "sqlite" ou "mongodb"' });
  }

  try {
    console.log(`🔄 Tentando conectar ao ${database}...`);
    
    // Se for MongoDB, tentar conectar
    if (database === 'mongodb' && currentDatabase !== 'mongodb') {
      console.log('🍃 Conectando ao MongoDB...');
      await connectMongo();
    }

    if (database === 'sqlite') {
      console.log('💾 SQLite selecionado (já inicializado)');
    }

    currentDatabase = database;
    console.log(`✅ Banco ${database} selecionado com sucesso!`);
    
    res.json({ 
      mensagem: `Banco de dados ${database.toUpperCase()} selecionado com sucesso!`,
      database: currentDatabase
    });
  } catch (error) {
    console.error('❌ Erro ao conectar:', error);
    res.status(500).json({ 
      erro: 'Erro ao conectar ao banco de dados',
      detalhes: error.message
    });
  }
});

// Rota para verificar qual banco está selecionado
app.get('/current-db', (req, res) => {
  res.json({ database: currentDatabase });
});

// Middleware para verificar se o banco foi selecionado
const checkDatabaseSelected = (req, res, next) => {
  if (!currentDatabase) {
    return res.status(400).json({ erro: 'Nenhum banco de dados selecionado. Use POST /select-db primeiro.' });
  }
  next();
};

// Rotas de alunos - dinâmicas baseadas no banco selecionado
app.use('/alunos', checkDatabaseSelected, (req, res, next) => {
  // Seleciona o controlador baseado no banco atual
  const controller = currentDatabase === 'mongodb' ? mongoController : sqliteController;
  const routes = createRoutes(controller);
  routes(req, res, next);
});

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Middleware de erro genérico
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ erro: 'Erro interno do servidor', detalhes: err.message });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📝 Acesse: http://localhost:${PORT}`);
  console.log(`💾 Selecione o banco de dados via POST /select-db\n`);
});

