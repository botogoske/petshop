# 🐾 PetShop Manager

Sistema completo de gestão para petshops com autenticação, agendamentos e cadastros.

## Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Banco de Dados**: PostgreSQL via Prisma 7 (com driver adapter `@prisma/adapter-pg`)
- **Auth**: NextAuth.js v5 (credentials provider)
- **UI**: shadcn/ui (`@base-ui/react`) + Tailwind CSS
- **Formulários**: React Hook Form + Zod
- **Ícones**: React Icons

## Funcionalidades

| Módulo | Descrição |
|--------|-----------|
| 🔐 Login | Autenticação de funcionários com email/senha |
| 📅 Consultas | Agendamento e gestão de consultas veterinárias |
| 💉 Vacinas | Registro e controle de vacinação |
| 🛁 Banho e Tosa | Agendamentos de banho e tosa |
| 👥 Funcionários | Cadastro e gestão de funcionários |
| 🩺 Veterinários | Cadastro de veterinários com CRMV |
| 🐶 Pets | Cadastro de animais |
| 👤 Tutores | Cadastro de tutores/donos |
| 📦 Produtos | Controle de estoque de produtos |

## Configuração

### 1. Variáveis de ambiente

Crie um arquivo `.env` na raiz:

```env
AUTH_SECRET="sua-chave-secreta-aqui"
DATABASE_URL="postgresql://user:password@localhost:5432/petshop?schema=public"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Banco de dados

```bash
# Criar tabelas
npx prisma migrate dev --name init

# Popular dados iniciais
npm run db:seed
```

Após o seed, você pode acessar com:
- **Admin**: `admin@petshop.com` / `admin123`
- **Funcionário**: `funcionario@petshop.com` / `func123`

### 3. Iniciar

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## Scripts

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run db:migrate   # Aplicar migrações
npm run db:seed      # Popular banco com dados iniciais
npm run db:studio    # Abrir Prisma Studio
```
