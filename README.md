# Mapa de Eventos

Sistema web para visualização de eventos e stands em mapa interativo utilizando geolocalização.

---

# Tecnologias Utilizadas

## Frontend

* React
* Vite
* Leaflet
* React Leaflet

## Backend

* Node.js
* Express
* MySQL2
* Dotenv

## Banco de Dados

* MySQL 8
* Docker

---

# Estrutura do Projeto

```bash
project/
│
├── backend/
├── frontend/
├── database/
└── docker-compose.yml
```

---

# Pré-requisitos

Antes de iniciar o projeto, instale:

## Obrigatórios

### Node.js

Download:
[https://nodejs.org/](https://nodejs.org/)

Verificar instalação:

```bash
node -v
npm -v
```

---

### Docker Desktop

Download:
[https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

Verificar instalação:

```bash
docker -v
```

---

# Primeira Inicialização do Projeto

---

# 1. Clonar o Repositório

```bash
git clone URL_DO_REPOSITORIO
```

Entrar na pasta:

```bash
cd nome-do-projeto
```

---

# 2. Instalar Dependências do Backend

```bash
cd backend
npm install
```

---

# 3. Instalar Dependências do Frontend

```bash
cd ../frontend
npm install
```

---

# 4. Subir Banco de Dados Docker

Na raiz do projeto:

```bash
docker compose up -d
```

Verificar se o container está rodando:

```bash
docker ps
```

Deve aparecer:

```bash
mapa-eventos-mysql
```

---

# 5. Criar Estrutura do Banco

Ainda na raiz do projeto:

## Windows PowerShell

```powershell
Get-Content .\database\schema.sql | docker exec -i mapa-eventos-mysql mysql -u root -proot mapa_eventos
```

---

# 6. Inserir Dados Iniciais

## Windows PowerShell

```powershell
Get-Content .\database\seed.sql | docker exec -i mapa-eventos-mysql mysql -u root -proot mapa_eventos
```

---

# 7. Configurar Variáveis de Ambiente

Criar arquivo:

```bash
backend/.env
```

Conteúdo:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=mapa_eventos
```

---

# 8. Rodar Backend

Entrar na pasta backend:

```bash
cd backend
```

Executar:

```bash
npm run dev
```

Servidor rodando em:

```text
http://localhost:3000
```

---

# 9. Rodar Frontend

Abrir outro terminal.

Entrar na pasta frontend:

```bash
cd frontend
```

Executar:

```bash
npm run dev
```

Frontend rodando em:

```text
http://localhost:5173
```

---

# Inicializações Futuras

Após a primeira configuração, basta:

---

# 1. Subir Banco

Na raiz do projeto:

```bash
docker compose up -d
```

---

# 2. Rodar Backend

```bash
cd backend
npm run dev
```

---

# 3. Rodar Frontend

```bash
cd frontend
npm run dev
```

---

# Encerrar Aplicação

---

## Parar Backend e Frontend

Pressione:

```bash
CTRL + C
```

---

## Parar Banco Docker

Na raiz do projeto:

```bash
docker compose down
```

---

# Scripts SQL

## schema.sql

Responsável por criar as tabelas do banco.

## seed.sql

Responsável por inserir dados iniciais para testes.

---

# Estrutura Backend

```bash
backend/src/
│
├── controllers/
├── routes/
├── services/
├── database/
└── app.js
```

---

# Estrutura Frontend

```bash
frontend/src/
│
├── components/
├── services/
├── App.jsx
└── main.jsx
```

---

# Comandos Úteis

## Ver containers ativos

```bash
docker ps
```

---

## Ver logs do MySQL

```bash
docker logs mapa-eventos-mysql
```

---

## Reiniciar banco

```bash
docker compose restart
```

---

# Observações

* Não subir node_modules para o Git.
* Não subir arquivos .env.
* Utilizar o arquivo .gitignore da raiz do projeto.
* Backend e frontend devem ser executados separadamente.

---

# Fluxo Geral do Sistema

```text
Frontend React
    ↓
Backend Express
    ↓
MySQL Docker
```
