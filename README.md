# 📚 Livro Digital

Aplicação web para criar, editar e exportar livros digitais em formato PDF estruturado.

## Tecnologias

- **Next.js 16** — Framework React com App Router
- **TypeScript** — Tipagem estática
- **Tailwind CSS 4** — Estilização
- **Prisma 7** — ORM para base de dados
- **SQLite** — Base de dados local (via better-sqlite3)
- **PDFKit** — Geração de PDFs estruturados

## Funcionalidades

- 📖 Criar e gerir múltiplos livros
- ✏️ Editor de capítulos com interface intuitiva
- 📄 Exportação para PDF com capa, índice e capítulos formatados
- 📚 Modo de leitura com navegação entre capítulos
- 🎨 Personalização da cor da capa
- 🗑️ Eliminar livros e capítulos

## Começar

### Pré-requisitos

- Node.js 20+
- npm

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/luisquetadev/digital-book.git
cd digital-book

# Instalar dependências (gera automaticamente o Prisma Client)
npm install

# Criar a base de dados
npx prisma migrate dev

# Iniciar o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

### Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Cria a build de produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Executa o linter |
| `npm run db:migrate` | Cria/aplica migrações da base de dados |
| `npm run db:push` | Sincroniza o schema com a base de dados |
| `npm run db:studio` | Abre o Prisma Studio para gerir dados |

## Estrutura do Projecto

```
src/
├── app/
│   ├── api/
│   │   └── books/
│   │       ├── route.ts          # GET/POST livros
│   │       └── [id]/
│   │           ├── route.ts      # GET/PUT/DELETE livro
│   │           ├── chapters/
│   │           │   ├── route.ts  # GET/POST capítulos
│   │           │   └── [chapterId]/
│   │           │       └── route.ts  # GET/PUT/DELETE capítulo
│   │           └── pdf/
│   │               └── route.ts  # GET gerar PDF
│   ├── books/
│   │   └── [id]/
│   │       ├── page.tsx          # Detalhes do livro
│   │       ├── edit/
│   │       │   └── page.tsx      # Editor de capítulos
│   │       └── read/
│   │           └── page.tsx      # Modo de leitura
│   ├── layout.tsx
│   └── page.tsx                  # Página inicial
├── components/
│   ├── BookCard.tsx
│   └── CreateBookModal.tsx
├── lib/
│   └── prisma.ts                 # Singleton do Prisma Client
└── generated/
    └── prisma/                   # Cliente Prisma gerado
prisma/
├── schema.prisma                 # Schema da base de dados
└── migrations/                   # Migrações
```

## API

### Livros

- `GET /api/books` — Listar todos os livros
- `POST /api/books` — Criar um livro
- `GET /api/books/:id` — Obter um livro
- `PUT /api/books/:id` — Actualizar um livro
- `DELETE /api/books/:id` — Eliminar um livro

### Capítulos

- `GET /api/books/:id/chapters` — Listar capítulos
- `POST /api/books/:id/chapters` — Criar um capítulo
- `GET /api/books/:id/chapters/:chapterId` — Obter um capítulo
- `PUT /api/books/:id/chapters/:chapterId` — Actualizar um capítulo
- `DELETE /api/books/:id/chapters/:chapterId` — Eliminar um capítulo

### PDF

- `GET /api/books/:id/pdf` — Gerar e descarregar o PDF do livro
