# Backend - Atividades Complementares (Node.js + MongoDB)

API REST feita com **Express**, **Mongoose** e **MongoDB Atlas**.

---

## 📁 Estrutura do Projeto

```
backend/
├── models/
│   ├── Usuario.js       # Alunos, Coordenadores e Admins
│   ├── Curso.js         # Cursos com regras embutidas
│   ├── Categoria.js     # Categorias de atividades
│   └── Atividade.js     # Solicitações com avaliação embutida
├── routes/
│   ├── auth.js          # POST /api/auth/login
│   ├── alunos.js        # CRUD de alunos
│   ├── coordenadores.js # CRUD de coordenadores
│   ├── cursos.js        # CRUD de cursos
│   ├── categorias.js    # CRUD de categorias
│   ├── solicitacoes.js  # CRUD + aprovar/rejeitar
│   └── dashboard.js     # Métricas gerais
├── swagger.js           # Configuração do Swagger
├── server.js            # Ponto de entrada da aplicação
├── .env.example         # Exemplo de variáveis de ambiente
└── package.json
```

---

## ⚙️ Como Rodar Localmente

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar o `.env`
Copie o arquivo `.env.example` e renomeie para `.env`:
```bash
cp .env.example .env
```

Edite o `.env` com sua string de conexão do MongoDB Atlas:
```
PORT=3000
MONGODB_URI=mongodb+srv://SEU_USUARIO:SUA_SENHA@cluster0.xxxxx.mongodb.net/atividades_complementares?retryWrites=true&w=majority
```

### 3. Iniciar o servidor
```bash
# Modo normal
npm start

# Modo desenvolvimento (com auto-reload)
npm run dev
```

### 4. Acessar a documentação
Abra no navegador: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 🚀 Deploy no Render

1. Faça push do projeto para o GitHub (sem o `.env`)
2. Crie um novo **Web Service** no [Render](https://render.com)
3. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Adicione as variáveis de ambiente no painel do Render:
   - `MONGODB_URI` = sua string de conexão do Atlas
   - `SERVER_URL` = a URL do seu app no Render (ex: `https://meu-app.onrender.com`)

---

## 📌 Endpoints Disponíveis

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login` | Login |
| GET | `/api/alunos` | Listar alunos |
| GET | `/api/alunos/:id` | Buscar aluno por ID |
| POST | `/api/alunos` | Cadastrar aluno |
| PUT | `/api/alunos/:id` | Atualizar aluno |
| DELETE | `/api/alunos/:id` | Remover aluno |
| GET | `/api/coordenadores` | Listar coordenadores |
| GET | `/api/coordenadores/:id` | Buscar coordenador por ID |
| POST | `/api/coordenadores` | Cadastrar coordenador |
| DELETE | `/api/coordenadores/:id` | Remover coordenador |
| GET | `/api/cursos` | Listar cursos |
| GET | `/api/cursos/:id` | Buscar curso por ID |
| POST | `/api/cursos` | Criar curso |
| PUT | `/api/cursos/:id` | Atualizar curso |
| DELETE | `/api/cursos/:id` | Remover curso |
| GET | `/api/categorias` | Listar categorias |
| GET | `/api/categorias/:id` | Buscar categoria por ID |
| POST | `/api/categorias` | Criar categoria |
| DELETE | `/api/categorias/:id` | Remover categoria |
| GET | `/api/solicitacoes` | Listar solicitações (com filtro ?status=) |
| GET | `/api/solicitacoes/:id` | Buscar solicitação por ID |
| GET | `/api/solicitacoes/aluno/:idAluno` | Listar por aluno |
| POST | `/api/solicitacoes` | Criar solicitação |
| PUT | `/api/solicitacoes/:id/aprovar` | Aprovar solicitação |
| PUT | `/api/solicitacoes/:id/rejeitar` | Rejeitar solicitação |
| GET | `/api/dashboard` | Métricas do sistema |

---

## 🧪 Exemplos de Requisição JSON

### Login
```json
POST /api/auth/login
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

### Cadastrar Aluno
```json
POST /api/alunos
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456",
  "matricula": "2024001",
  "telefone": "(81) 99999-0000",
  "idCurso": "664f1a2b3c4d5e6f7a8b9c0d"
}
```

### Criar Solicitação
```json
POST /api/solicitacoes
{
  "titulo": "Participação em congresso de TI",
  "descricao": "Evento realizado em Recife com 3 dias de duração",
  "cargaHoraria": 20,
  "idAluno": "664f1a2b3c4d5e6f7a8b9c0d",
  "idCurso": "664f1a2b3c4d5e6f7a8b9c0e",
  "idCategoria": "664f1a2b3c4d5e6f7a8b9c0f"
}
```

### Aprovar Solicitação
```json
PUT /api/solicitacoes/:id/aprovar
{
  "idCoordenador": "664f1a2b3c4d5e6f7a8b9c0a",
  "cargaHorariaValidada": 20
}
```

### Criar Curso
```json
POST /api/cursos
{
  "nome": "Ciência da Computação",
  "cargaHorariaTotal": 200,
  "regra": {
    "cargaHorariaMin": 10,
    "cargaHorariaMax": 60
  }
}
```
