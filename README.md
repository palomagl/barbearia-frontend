# 💈 BarberShop System

![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

Sistema completo de agendamentos para barbearias. O projeto oferece uma interface intuitiva para clientes e um painel administrativo robusto para o barbeiro gerenciar sua agenda e faturamento.

## ✨ Funcionalidades

### 🙋‍♂️ Para o Cliente
- **Agendamento Online:** Validação de horários e prevenção de conflitos.
- **Gestão de Horários:** Visualização de status e cancelamento (regra de 2h de antecedência).
- **Segurança:** Cadastro e login autenticado via JWT.

### ✂️ Para o Barbeiro (Admin)
- **Painel Administrativo:** Visualização geral da agenda com interface Mobile First.
- **Faturamento:** Cálculo automático de ganhos baseado em serviços concluídos.
- **WhatsApp:** Botão para confirmação de horários com mensagem personalizada.

---

## 🛠️ Tecnologias

- **Frontend:** Vue.js 3, Vite, Axios, SweetAlert2.
- **Backend:** Node.js, Express, JWT, Bcrypt.
- **Banco de Dados:** PostgreSQL (Neon.tech).

---

## 🚀 Como Rodar o Projeto

### 1. Requisitos
- Node.js instalado e uma instância de PostgreSQL.

### 2. Configuração (Backend)
Crie um arquivo `.env` em `/backend`:
```env
DATABASE_URL=sua_url_do_postgres
JWT_SECRET=sua_chave_secreta
PORT=3000
```

### 3. Execução
Para rodar o sistema completo, abra dois terminais:
#### Terminal 1: Backend
```bash 
cd backend && npm install && node index.js
```

#### Terminal 2: Frontend
```bash
cd frontend && npm install && npm run dev
```

---

## 🗄️ Estrutura do Banco (SQL)

<details>
<summary>Clique para expandir as tabelas do banco de dados</summary>

```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cargo VARCHAR(50) DEFAULT 'user',
    telefone VARCHAR(20)
);

CREATE TABLE agendamentos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    data_hora TIMESTAMP NOT NULL,
    descricao TEXT,
    status VARCHAR(50) DEFAULT 'pendente'
);
```
</details>

## 🔒 Regras de Negócio e Segurança

- **Segurança:** Senhas protegidas com `Bcrypt` e autenticação via `JWT`.
- **Cancelamento:** Sistema bloqueia cancelamentos com menos de **2 horas** de antecedência.
- **Conflitos:** Verificação em tempo real para impedir dois agendamentos no mesmo horário.
- **Admin:** Controle de faturamento total e gestão de status de serviços.

---

## 📩 Contato

Se tiver alguma dúvida ou quiser bater um papo sobre o projeto, me chama aí:

[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/palomagl)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/5551998127367)

---

> Desenvolvido com foco em soluções reais para negócios locais. 