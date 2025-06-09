# EFR-TASKS - Sistema de Tarefas Categorizadas

## 🧠 Descrição do Projeto

Este projeto foi desenvolvido como parte da entrega A3 da disciplina **Sistemas Distribuídos e Mobile**, com o objetivo de aplicar os conceitos de microsserviços, autenticação, persistência de dados e documentação de APIs.

A aplicação expõe três microsserviços principais:
- Usuários (com autenticação via JWT)
- Tarefas (CRUD completo com associação a categorias)
- Categorias (CRUD completo)

Os dados são armazenados em arquivos `.json`, simulando um banco de dados não relacional.

---

## 👥 Integrantes do Grupo

- **Eduardo De Santana Maria** — RA: 821224129
- **Felipe Campos Losano** — RA: 821234991
- **Rafael Colete Moreira** — RA: 821231041

---

## 🚀 Instruções para Executar

### Com Docker

1. Certifique-se de que os arquivos `users.json`, `tasks.json` e `categories.json` estão dentro da pasta `models/`.

2. Execute o seguinte comando:

```bash
docker-compose up --build
```

A aplicação será iniciada em `http://localhost:3000`.

### Sem Docker

1. Instale as dependências:
```bash
npm install
```

2. Crie o arquivo `.env` com sua chave JWT:
```
JWT_SECRET=sua_chave_secreta
```

3. Execute a aplicação:
```bash
node server.js
```

---

## 🧪 Testes com Postman

- Utilize a coleção do postman `ERF_TASKS_COLLECTION.json` disponível no repositório na pasta `/EXAMPLE/`.
- Organizada em:
    - Autenticação
    - Tarefas
    - Categorias

A collection possui script automático para capturar o token de login e armazenar na variável `{{token}}`.

---

## 📘 Documentação com Swagger

A documentação da API está disponível em:

```
http://localhost:3000/api-docs
```

Arquivo Swagger incluído no projeto: `swagger.json`.

---

## 🗂 Estrutura do Projeto

```
├── controllers/
├── EXAMPLE/       
│   ├── ERF_TASKS_COLLECTION.json
│   └── swagger.json
├── middleware/
├── models/               # <-- Dados persistidos via volume Docker
│   ├── users.json
│   ├── tasks.json
│   └── categories.json
├── routes/
├── server.js
├── Dockerfile
└── docker-compose.yml
```
