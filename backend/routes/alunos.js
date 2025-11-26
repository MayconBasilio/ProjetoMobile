const express = require('express');
const router = express.Router();

// Função para criar rotas com o controlador apropriado
const createRoutes = (controller) => {
  const routerInstance = express.Router();

  // GET /alunos - Listar todos os alunos
  routerInstance.get('/', controller.listar);

  // GET /alunos/:id - Buscar aluno por ID
  routerInstance.get('/:id', controller.buscarPorId);

  // POST /alunos - Adicionar novo aluno
  routerInstance.post('/', controller.adicionar);

  // PUT /alunos/:id - Editar aluno
  routerInstance.put('/:id', controller.editar);

  // DELETE /alunos/:id - Deletar aluno
  routerInstance.delete('/:id', controller.deletar);

  return routerInstance;
};

module.exports = createRoutes;

