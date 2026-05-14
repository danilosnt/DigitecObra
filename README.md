# DigitecObra Manager

Aplicação web (SPA) para gestão de custos em projetos de construção civil. Permite cadastrar obras, lançar e acompanhar custos com dashboard financeiro em tempo real, e conta com um assistente de lançamento inteligente via IA generativa.

## Funcionalidades

- **Gestão de Obras** — Criar, listar e remover projetos/obras.
- **Gestão de Custos** — Dentro de cada obra: inserir, editar, visualizar e remover itens de custo.
- **Dashboard Financeiro** — Custo total, total pago e total pendente calculados dinamicamente.
- **Filtros** — Filtrar custos por categoria e status de pagamento.
- **Lançamento Inteligente (IA)** — Campo de texto livre onde a IA extrai automaticamente os dados do custo e preenche o formulário.
- **Persistência Local** — Dados salvos no LocalStorage do navegador.

## Stack Tecnológica

| [React 18](https://react.dev) | Biblioteca de UI |
| [TypeScript](https://www.typescriptlang.org) | Tipagem estática |
| [Vite](https://vite.dev) | Bundler e dev server |
| [Tailwind CSS 4](https://tailwindcss.com) | Estilização utilitária |
| [React Router DOM](https://reactrouter.com) | Navegação SPA |
| [Lucide React](https://lucide.dev) | Ícones |
| [React Hot Toast](https://react-hot-toast.com) | Notificações toast |
| [UUID](https://github.com/uuidjs/uuid) | Geração de IDs únicos |

## API Utilizada

| API | Modelo | Finalidade |
|---|---|---|
| [Google Generative AI](https://ai.google.dev) | `gemini-2.5-flash` | Extração inteligente de dados de custo a partir de texto livre |

A integração roda via Vercel Serverless Function (`/api/extract`) em produção, mantendo a chave da API protegida no servidor.

## Como Rodar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Criar o arquivo .env na raiz com sua chave
VITE_GEMINI_API_KEY=sua_chave_aqui

# 3. Iniciar o servidor de desenvolvimento
npm run dev
```

## Estrutura do Projeto

```
src/
├── domain/models/         # Interfaces e tipos (Project, CostItem)
├── infrastructure/
│   ├── api/               # Integração com Gemini API
│   ├── logger/            # Logger estruturado (JSON)
│   └── storage/           # Repository para LocalStorage
├── application/hooks/     # Hooks de negócio (useProjects, useCosts)
├── presentation/
│   ├── components/        # Componentes UI reutilizáveis
│   ├── features/          # Componentes complexos (Dashboard, CostForm)
│   ├── layouts/           # Layout principal
│   └── pages/             # Páginas da aplicação
└── utils/                 # Utilitários (formatação de moeda)
api/
└── extract.ts             # Vercel Serverless Function (proxy Gemini)
```
