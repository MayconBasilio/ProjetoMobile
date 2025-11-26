# Backend - API CRUD de Alunos

API RESTful desenvolvida com Node.js e Express para gerenciamento de alunos, com suporte a SQLite e MongoDB.

## 🚀 Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de configuração
copy .env.example .env  # Windows
cp .env.example .env    # Linux/Mac

# Iniciar servidor
npm start

# Ou usar nodemon para desenvolvimento
npm run dev
```

## 📝 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/alunos_db
```

## 🔌 Endpoints

### Seleção de Banco

#### POST /select-db
Seleciona qual banco de dados usar (sqlite ou mongodb).

**Request Body:**
```json
{
  "database": "sqlite"  // ou "mongodb"
}
```

**Response (Success):**
```json
{
  "mensagem": "Banco de dados SQLITE selecionado com sucesso!",
  "database": "sqlite"
}
```

**Response (Error):**
```json
{
  "erro": "Banco de dados inválido. Use 'sqlite' ou 'mongodb'"
}
```

---

#### GET /current-db
Verifica qual banco está atualmente selecionado.

**Response:**
```json
{
  "database": "sqlite"  // ou "mongodb" ou null
}
```

---

### CRUD de Alunos

**Importante:** Todos os endpoints de alunos requerem que um banco de dados tenha sido selecionado primeiro via POST /select-db.

---

#### GET /alunos
Lista todos os alunos cadastrados.

**Response (Success):**
```json
[
  {
    "id": 1,  // ou "_id" para MongoDB
    "nome": "João Silva",
    "telefone": "(11) 98765-4321",
    "dataNascimento": "15/05/2000",
    "email": "joao@email.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Response (Error):**
```json
{
  "erro": "Nenhum banco de dados selecionado. Use POST /select-db primeiro."
}
```

---

#### GET /alunos/:id
Busca um aluno específico por ID.

**Parameters:**
- `id` - ID do aluno (integer para SQLite, ObjectId para MongoDB)

**Response (Success):**
```json
{
  "id": 1,
  "nome": "João Silva",
  "telefone": "(11) 98765-4321",
  "dataNascimento": "15/05/2000",
  "email": "joao@email.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Response (Error):**
```json
{
  "erro": "Aluno não encontrado"
}
```

---

#### POST /alunos
Adiciona um novo aluno.

**Request Body:**
```json
{
  "nome": "Maria Santos",
  "telefone": "(11) 91234-5678",
  "dataNascimento": "20/03/1998",
  "email": "maria@email.com"
}
```

**Validações:**
- `nome`: obrigatório, mínimo 3 caracteres
- `telefone`: obrigatório
- `dataNascimento`: obrigatório
- `email`: obrigatório, deve conter @

**Response (Success - 201):**
```json
{
  "mensagem": "Aluno cadastrado com sucesso!",
  "id": 2
}
```

**Response (Error - 400):**
```json
{
  "erro": "Nome é obrigatório e deve ter no mínimo 3 caracteres"
}
```

```json
{
  "erro": "Email já cadastrado"
}
```

---

#### PUT /alunos/:id
Atualiza os dados de um aluno existente.

**Parameters:**
- `id` - ID do aluno

**Request Body:**
```json
{
  "nome": "João Silva Santos",
  "telefone": "(11) 98765-4321",
  "dataNascimento": "15/05/2000",
  "email": "joao.silva@email.com"
}
```

**Validações:** (mesmas do POST)

**Response (Success):**
```json
{
  "mensagem": "Aluno atualizado com sucesso!"
}
```

**Response (Error):**
```json
{
  "erro": "Aluno não encontrado"
}
```

```json
{
  "erro": "Email já cadastrado para outro aluno"
}
```

---

#### DELETE /alunos/:id
Remove um aluno.

**Parameters:**
- `id` - ID do aluno

**Response (Success):**
```json
{
  "mensagem": "Aluno removido com sucesso!"
}
```

**Response (Error):**
```json
{
  "erro": "Aluno não encontrado"
}
```

---

## 🗄️ Bancos de Dados

### SQLite

- Arquivo: `alunos.db` (criado automaticamente)
- Não requer instalação adicional
- Perfeito para desenvolvimento e testes
- Tabela criada automaticamente ao iniciar o servidor

**Schema:**
```sql
CREATE TABLE alunos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  dataNascimento TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### MongoDB

- Requer MongoDB instalado e rodando
- Connection string configurável via `.env`
- Collection: `alunos`

**Schema (Mongoose):**
```javascript
{
  nome: String (required, minlength: 3),
  telefone: String (required),
  dataNascimento: String (required),
  email: String (required, unique, lowercase),
  timestamps: true
}
```

**Instalação do MongoDB:**

- **Windows:** [Baixar MongoDB Community](https://www.mongodb.com/try/download/community)
- **Linux:** `sudo apt install mongodb` ou `sudo yum install mongodb`
- **Mac:** `brew install mongodb-community`

**Iniciar MongoDB:**
```bash
mongod
```

---

## 🧪 Testando a API

### Usando cURL

```bash
# Selecionar banco SQLite
curl -X POST http://localhost:3000/select-db \
  -H "Content-Type: application/json" \
  -d '{"database":"sqlite"}'

# Listar alunos
curl http://localhost:3000/alunos

# Adicionar aluno
curl -X POST http://localhost:3000/alunos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "telefone": "(11) 98765-4321",
    "dataNascimento": "15/05/2000",
    "email": "joao@email.com"
  }'

# Atualizar aluno
curl -X PUT http://localhost:3000/alunos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva Santos",
    "telefone": "(11) 98765-4321",
    "dataNascimento": "15/05/2000",
    "email": "joao.silva@email.com"
  }'

# Deletar aluno
curl -X DELETE http://localhost:3000/alunos/1
```

### Usando Postman

1. Importe a URL base: `http://localhost:3000`
2. Crie as requisições conforme os endpoints acima
3. Lembre-se de selecionar o banco primeiro!

---

## 📂 Estrutura de Arquivos

```
backend/
├── db/
│   ├── sqlite.js          # Configuração e conexão SQLite
│   └── mongo.js           # Schema e conexão MongoDB
├── controllers/
│   └── alunoController.js # Lógica de negócio (sqlite e mongo)
├── routes/
│   └── alunos.js          # Definição de rotas
├── server.js              # Servidor Express principal
├── package.json
├── .env                   # Variáveis de ambiente (não versionado)
├── .env.example          # Exemplo de variáveis
├── .gitignore
└── README.md
```

---

## 🔒 CORS

O servidor está configurado para aceitar requisições de qualquer origem (desenvolvimento).

Para produção, configure o CORS adequadamente:

```javascript
app.use(cors({
  origin: 'http://seu-dominio.com'
}));
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'sqlite3'"
```bash
npm install sqlite3
```

### Erro: "MongooseError: Operation buffering timed out"
- Certifique-se de que o MongoDB está rodando
- Verifique a connection string no `.env`

### Erro: "EADDRINUSE: address already in use"
- A porta 3000 já está em uso
- Altere a porta no `.env` ou mate o processo:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # Linux/Mac
  lsof -ti:3000 | xargs kill -9
  ```

---

## 📦 Dependências

- `express` - Framework web
- `cors` - Middleware CORS
- `body-parser` - Parse de JSON
- `mongoose` - ODM para MongoDB
- `sqlite3` - Driver SQLite
- `dotenv` - Variáveis de ambiente
- `nodemon` (dev) - Auto-reload

---

## 🚀 Deploy

Para deploy em produção:

1. Configure variáveis de ambiente adequadas
2. Use um gerenciador de processos (PM2)
3. Configure HTTPS
4. Use MongoDB Atlas para banco cloud (opcional)

```bash
# Instalar PM2
npm install -g pm2

# Iniciar com PM2
pm2 start server.js --name "alunos-api"

# Configurar para iniciar no boot
pm2 startup
pm2 save
```

---

## 📝 Licença

Projeto educacional.

