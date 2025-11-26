const sqlite3Db = require('../db/sqlite');
const { Aluno } = require('../db/mongo');

// Controlador para SQLite
const sqliteController = {
  // Listar todos os alunos
  listar: (req, res) => {
    sqlite3Db.all('SELECT * FROM alunos ORDER BY id DESC', [], (err, rows) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao listar alunos', detalhes: err.message });
      }
      res.json(rows);
    });
  },

  // Buscar aluno por ID
  buscarPorId: (req, res) => {
    const { id } = req.params;
    sqlite3Db.get('SELECT * FROM alunos WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao buscar aluno', detalhes: err.message });
      }
      if (!row) {
        return res.status(404).json({ erro: 'Aluno não encontrado' });
      }
      res.json(row);
    });
  },

  // Adicionar novo aluno
  adicionar: (req, res) => {
    const { nome, telefone, dataNascimento, email } = req.body;

    // Validações básicas
    if (!nome || nome.length < 3) {
      return res.status(400).json({ erro: 'Nome é obrigatório e deve ter no mínimo 3 caracteres' });
    }
    if (!telefone) {
      return res.status(400).json({ erro: 'Telefone é obrigatório' });
    }
    if (!dataNascimento) {
      return res.status(400).json({ erro: 'Data de nascimento é obrigatória' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ erro: 'Email válido é obrigatório' });
    }

    const query = 'INSERT INTO alunos (nome, telefone, dataNascimento, email) VALUES (?, ?, ?, ?)';
    sqlite3Db.run(query, [nome, telefone, dataNascimento, email], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ erro: 'Email já cadastrado' });
        }
        return res.status(500).json({ erro: 'Erro ao adicionar aluno', detalhes: err.message });
      }
      res.status(201).json({ 
        mensagem: 'Aluno cadastrado com sucesso!',
        id: this.lastID 
      });
    });
  },

  // Editar aluno
  editar: (req, res) => {
    const { id } = req.params;
    const { nome, telefone, dataNascimento, email } = req.body;

    // Validações básicas
    if (!nome || nome.length < 3) {
      return res.status(400).json({ erro: 'Nome é obrigatório e deve ter no mínimo 3 caracteres' });
    }
    if (!telefone) {
      return res.status(400).json({ erro: 'Telefone é obrigatório' });
    }
    if (!dataNascimento) {
      return res.status(400).json({ erro: 'Data de nascimento é obrigatória' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ erro: 'Email válido é obrigatório' });
    }

    const query = 'UPDATE alunos SET nome = ?, telefone = ?, dataNascimento = ?, email = ? WHERE id = ?';
    sqlite3Db.run(query, [nome, telefone, dataNascimento, email, id], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ erro: 'Email já cadastrado para outro aluno' });
        }
        return res.status(500).json({ erro: 'Erro ao editar aluno', detalhes: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ erro: 'Aluno não encontrado' });
      }
      res.json({ mensagem: 'Aluno atualizado com sucesso!' });
    });
  },

  // Deletar aluno
  deletar: (req, res) => {
    const { id } = req.params;
    sqlite3Db.run('DELETE FROM alunos WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao deletar aluno', detalhes: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ erro: 'Aluno não encontrado' });
      }
      res.json({ mensagem: 'Aluno removido com sucesso!' });
    });
  }
};

// Controlador para MongoDB
const mongoController = {
  // Listar todos os alunos
  listar: async (req, res) => {
    try {
      const alunos = await Aluno.find().sort({ createdAt: -1 });
      res.json(alunos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar alunos', detalhes: error.message });
    }
  },

  // Buscar aluno por ID
  buscarPorId: async (req, res) => {
    try {
      const aluno = await Aluno.findById(req.params.id);
      if (!aluno) {
        return res.status(404).json({ erro: 'Aluno não encontrado' });
      }
      res.json(aluno);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar aluno', detalhes: error.message });
    }
  },

  // Adicionar novo aluno
  adicionar: async (req, res) => {
    try {
      const { nome, telefone, dataNascimento, email } = req.body;

      // Validações básicas
      if (!nome || nome.length < 3) {
        return res.status(400).json({ erro: 'Nome é obrigatório e deve ter no mínimo 3 caracteres' });
      }
      if (!telefone) {
        return res.status(400).json({ erro: 'Telefone é obrigatório' });
      }
      if (!dataNascimento) {
        return res.status(400).json({ erro: 'Data de nascimento é obrigatória' });
      }
      if (!email || !email.includes('@')) {
        return res.status(400).json({ erro: 'Email válido é obrigatório' });
      }

      const aluno = new Aluno({ nome, telefone, dataNascimento, email });
      await aluno.save();
      res.status(201).json({ 
        mensagem: 'Aluno cadastrado com sucesso!',
        id: aluno._id 
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ erro: 'Email já cadastrado' });
      }
      res.status(500).json({ erro: 'Erro ao adicionar aluno', detalhes: error.message });
    }
  },

  // Editar aluno
  editar: async (req, res) => {
    try {
      const { nome, telefone, dataNascimento, email } = req.body;

      // Validações básicas
      if (!nome || nome.length < 3) {
        return res.status(400).json({ erro: 'Nome é obrigatório e deve ter no mínimo 3 caracteres' });
      }
      if (!telefone) {
        return res.status(400).json({ erro: 'Telefone é obrigatório' });
      }
      if (!dataNascimento) {
        return res.status(400).json({ erro: 'Data de nascimento é obrigatória' });
      }
      if (!email || !email.includes('@')) {
        return res.status(400).json({ erro: 'Email válido é obrigatório' });
      }

      const aluno = await Aluno.findByIdAndUpdate(
        req.params.id,
        { nome, telefone, dataNascimento, email },
        { new: true, runValidators: true }
      );

      if (!aluno) {
        return res.status(404).json({ erro: 'Aluno não encontrado' });
      }

      res.json({ mensagem: 'Aluno atualizado com sucesso!' });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ erro: 'Email já cadastrado para outro aluno' });
      }
      res.status(500).json({ erro: 'Erro ao editar aluno', detalhes: error.message });
    }
  },

  // Deletar aluno
  deletar: async (req, res) => {
    try {
      const aluno = await Aluno.findByIdAndDelete(req.params.id);
      if (!aluno) {
        return res.status(404).json({ erro: 'Aluno não encontrado' });
      }
      res.json({ mensagem: 'Aluno removido com sucesso!' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao deletar aluno', detalhes: error.message });
    }
  }
};

module.exports = { sqliteController, mongoController };

