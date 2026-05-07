# Backend — Atividades Complementares

API REST desenvolvida com **Node.js**, **Express**, **Mongoose** e **MongoDB Atlas**.  
Deploy em produção: [https://backend-pi-zzw9.onrender.com](https://backend-pi-zzw9.onrender.com)  
Documentação Swagger: [https://backend-pi-zzw9.onrender.com/api-docs](https://backend-pi-zzw9.onrender.com/api-docs)

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| Node.js | 24.x | Runtime |
| Express | 4.18 | Framework HTTP |
| Mongoose | 8.x | ODM para MongoDB |
| MongoDB Atlas | — | Banco de dados na nuvem |
| bcryptjs | 2.4 | Hash de senhas |
| Swagger UI | 5.x | Documentação automática |
| Nodemon | 3.x | Auto-reload em desenvolvimento |

---

## 📁 Estrutura do Projeto

```
backend-PI/
├── models/
│   ├── Usuario.js       # Alunos, Coordenadores e Admins (perfil unificado)
│   ├── Curso.js         # Cursos com regras de carga horária embutidas
│   ├── Categoria.js     # Categorias de atividades complementares
│   └── Atividade.js     # Solicitações com avaliação embutida
├── routes/
│   ├── auth.js          # POST /api/auth/login (com bcrypt)
│   ├── alunos.js        # CRUD completo de alunos (com bcrypt no cadastro)
│   ├── coordenadores.js # CRUD de coordenadores (com bcrypt no cadastro)
│   ├── cursos.js        # CRUD de cursos
│   ├── categorias.js    # CRUD de categorias
│   ├── solicitacoes.js  # CRUD + aprovar/rejeitar solicitações
│   └── dashboard.js     # Métricas gerais do sistema
├── swagger.js           # Configuração do Swagger/OpenAPI
├── server.js            # Ponto de entrada da aplicação
├── .gitignore           # Ignora node_modules e .env
└── package.json
```

---

## ⚙️ Como Rodar Localmente

### Pré-requisitos
- Node.js 18+ instalado
- Conta no MongoDB Atlas com cluster criado
- Git Bash ou terminal compatível

### 1. Clonar o repositório
```bash
git clone https://github.com/ferreirajsx/backend-PI.git
cd backend-PI
```

### 2. Instalar dependências
```bash
npm install
```

> ⚠️ No Windows com PowerShell, se der erro de execução de scripts, troque para o terminal **Git Bash** ou **Command Prompt**.

### 3. Configurar o `.env`
Crie um arquivo `.env` na raiz do projeto:
```
PORT=3000
MONGODB_URI=mongodb+srv://SEU_USUARIO:SUA_SENHA@cluster0.xxxxx.mongodb.net/atividades_complementares?retryWrites=true&w=majority
NODE_ENV=development
```

### 4. Iniciar o servidor
```bash
# Modo desenvolvimento (com auto-reload)
npm run dev

# Modo produção
npm start
```

Se tudo estiver correto, o terminal exibirá:
```
✅ Conectado ao MongoDB Atlas com sucesso!
🚀 Servidor rodando na porta 3000
📄 Documentação disponível em http://localhost:3000/api-docs
```

---

## 🚀 Deploy no Render

1. Faça push do projeto para o GitHub (o `.env` nunca deve ser commitado)
2. Crie um novo **Web Service** em [render.com](https://render.com)
3. Conecte ao repositório `ferreirajsx/backend-PI`
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Adicione as variáveis de ambiente no painel do Render:
   - `MONGODB_URI` → string de conexão do Atlas
   - `NODE_ENV` → `production`
6. Clique em **Manual Deploy → Deploy latest commit**

---

## 🔐 Segurança

- Senhas de alunos e coordenadores são salvas com **hash bcrypt** (salt 10)
- O login compara a senha enviada com o hash usando `bcrypt.compare()`
- O campo `senha` nunca é retornado nas respostas da API (deletado antes do `res.json`)
- O arquivo `.env` está no `.gitignore` e nunca vai para o repositório

> ⚠️ Usuários cadastrados antes da implementação do bcrypt precisam ser recadastrados, pois suas senhas estão em texto puro e são incompatíveis com o novo sistema de login.

---

## 📌 Endpoints Disponíveis

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login` | Login (retorna id, nome, email, perfil) |

### Alunos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/alunos` | Listar todos os alunos |
| GET | `/api/alunos/:id` | Buscar aluno por ID |
| POST | `/api/alunos` | Cadastrar aluno (requer nome, email, senha, matricula) |
| PUT | `/api/alunos/:id` | Atualizar dados do aluno |
| DELETE | `/api/alunos/:id` | Remover aluno |

### Coordenadores
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/coordenadores` | Listar coordenadores |
| GET | `/api/coordenadores/:id` | Buscar coordenador por ID |
| POST | `/api/coordenadores` | Cadastrar coordenador (requer nome, email, senha) |
| DELETE | `/api/coordenadores/:id` | Remover coordenador |

### Cursos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/cursos` | Listar cursos |
| GET | `/api/cursos/:id` | Buscar curso por ID |
| POST | `/api/cursos` | Criar curso |
| PUT | `/api/cursos/:id` | Atualizar curso |
| DELETE | `/api/cursos/:id` | Remover curso |

### Categorias
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/categorias` | Listar categorias |
| GET | `/api/categorias/:id` | Buscar categoria por ID |
| POST | `/api/categorias` | Criar categoria |
| DELETE | `/api/categorias/:id` | Remover categoria |

### Solicitações
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/solicitacoes` | Listar solicitações (filtro: `?status=pendente`) |
| GET | `/api/solicitacoes/:id` | Buscar solicitação por ID |
| GET | `/api/solicitacoes/aluno/:idAluno` | Listar solicitações de um aluno |
| POST | `/api/solicitacoes` | Criar solicitação |
| PUT | `/api/solicitacoes/:id/aprovar` | Aprovar solicitação |
| PUT | `/api/solicitacoes/:id/rejeitar` | Rejeitar solicitação |

### Dashboard
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/dashboard` | Métricas gerais (pendentes, alunos, cursos, taxa aprovação) |

---

## 🧪 Exemplos de Requisição JSON

### Login
```json
POST /api/auth/login
{
  "email": "coordenador@email.com",
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
  "idCurso": "69fbaeb6e81c6a95c8d11794"
}
```

### Cadastrar Coordenador
```json
POST /api/coordenadores
{
  "nome": "Maria Oliveira",
  "email": "maria@email.com",
  "senha": "senha123",
  "idCurso": "69fbaeb6e81c6a95c8d11794"
}
```

### Criar Solicitação
```json
POST /api/solicitacoes
{
  "titulo": "Participação em congresso de TI",
  "descricao": "Evento realizado em Recife com 3 dias de duração",
  "cargaHoraria": 20,
  "idAluno": "69fbc51b505bfaa00a8fb08d",
  "idCurso": "69fbaeb6e81c6a95c8d11794",
  "idCategoria": "69fbba6cb44a27bf355bc6bd"
}
```

### Aprovar Solicitação
```json
PUT /api/solicitacoes/:id/aprovar
{
  "cargaHorariaValidada": 20
}
```

### Rejeitar Solicitação
```json
PUT /api/solicitacoes/:id/rejeitar
{
  "observacao": "Documentação insuficiente"
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
