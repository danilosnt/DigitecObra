# 🎤 Guia de Apresentação — Ticket System (Parte 2)

---

## 7. Tecnologias e Bibliotecas Utilizadas

| Tecnologia | Versão | Para que serve |
|---|---|---|
| **C# / .NET** | 10.0 | Linguagem e runtime do backend |
| **ASP.NET Core MVC** | 10.0 | Framework web (Controllers + Views Razor) |
| **ASP.NET Core Web API** | 10.0 | Endpoints REST (`/api/...`) |
| **Entity Framework Core** | 10.0.7 | ORM — mapeia classes C# para tabelas SQL |
| **Npgsql (EF Core PostgreSQL)** | 10.0.1 | Driver para conectar ao PostgreSQL |
| **PostgreSQL** | — | Banco de dados relacional |
| **Bootstrap** | 5.3.0 | Framework CSS para layout responsivo e modais |
| **jQuery** | 3.6.0 | Biblioteca JS para chamadas AJAX e manipulação DOM |
| **Font Awesome** | 6.5.0 | Ícones vetoriais (fas fa-ticket-alt, etc.) |
| **Google Fonts (Inter)** | — | Tipografia moderna |
| **Razor (.cshtml)** | — | Template engine do ASP.NET para gerar HTML dinâmico |
| **Session (DistributedMemoryCache)** | — | Gerenciamento de sessão/autenticação |
| **SHA-256** | — | Hash de senhas (System.Security.Cryptography) |

**Pacotes NuGet (do `.csproj`):**
```xml
<PackageReference Include="Microsoft.AspNetCore.Mvc.Razor.RuntimeCompilation" Version="10.0.7" />
<PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="10.0.7" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="10.0.7" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="10.0.7" />
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="10.0.1" />
```

---

## 8. Testes Unitários e Microsserviços

### O que são Testes Unitários?
Testes unitários são **testes automatizados** que verificam se uma unidade individual do código (um método, uma classe) funciona corretamente de forma isolada.

**Exemplo hipotético para o Ticket System:**
```csharp
[Fact]
public void NaoDeveFinalizar_ChamadoAberto()
{
    var ticket = new Ticket("Teste", "Desc", "TI", "Alta", Guid.NewGuid());
    // Status é "Aberto", não "EmAndamento"
    
    Assert.Throws<InvalidOperationException>(() =>
        ticket.FinishAttendance("Solução", DateTime.UtcNow, Guid.NewGuid())
    );
}

[Fact]
public void DeveIniciarAtendimento_ChamadoAberto()
{
    var ticket = new Ticket("Teste", "Desc", "TI", "Alta", Guid.NewGuid());
    ticket.StartAttendance(DateTime.UtcNow, Guid.NewGuid());
    
    Assert.Equal(TicketStatus.EmAndamento, ticket.Status);
}
```

**Se aplica no projeto?** O projeto **não possui testes unitários implementados** atualmente, mas a arquitetura do `Ticket.cs` com seus métodos de negócio (`StartAttendance`, `FinishAttendance`, `CancelTicket`) foi **projetada de forma altamente testável** graças ao encapsulamento.

### O que são Microsserviços?
Microsserviços é uma arquitetura onde a aplicação é dividida em **serviços pequenos e independentes**, cada um com seu próprio banco de dados e deploy.

**Se aplica no projeto?** **Não.** O projeto usa arquitetura **monolítica** — tudo (API, Views, autenticação, banco) roda em um único processo. Isso é adequado para o tamanho do projeto. Uma evolução para microsserviços seria:

```
Monolito atual:          Microsserviços (hipotético):
┌──────────────┐         ┌────────────┐  ┌──────────────┐
│  Auth + API  │         │ Auth-Service│  │ Ticket-Service│
│  + Views     │   →     │  (porta X) │  │  (porta Y)   │
│  + Banco     │         │  [UserDB]  │  │  [TicketDB]  │
└──────────────┘         └────────────┘  └──────────────┘
```

---

## 9. Estruturas de Dados

### O que são Estruturas de Dados?
Estruturas de dados são **formas de organizar e armazenar dados na memória** para que possam ser acessados e modificados de forma eficiente.

### Lista, Pilha, Fila e Árvore

| Estrutura | O que é | Acesso | Analogia |
|---|---|---|---|
| **Lista** | Coleção ordenada com acesso por índice | Qualquer posição | Lista de compras |
| **Pilha (Stack)** | LIFO — Last In, First Out | Só topo | Pilha de pratos |
| **Fila (Queue)** | FIFO — First In, First Out | Só frente | Fila de banco |
| **Árvore** | Hierárquica com nós pai/filho | Navegação por nós | Organograma |

### Se aplicam no projeto?

**✅ Lista (`List<T>`) — SIM, muito usada!**

```csharp
// TicketController.cs — GetAllTickets retorna uma LISTA
var tickets = query.OrderByDescending(t => t.CreatedAt).ToList();

// AuthController.cs — GetAllUsers retorna uma LISTA
var users = _context.Users.Select(u => new { ... }).ToList();

// TicketController.cs — GetComments retorna uma LISTA
var comments = _context.TicketComments.Where(c => c.TicketId == id).ToList();
```

**✅ Dicionário (`Dictionary<K,V>`) — SIM, usado para SLA!**
```csharp
// TicketController.cs — Mapa de prioridade → horas SLA
private static readonly Dictionary<string, int> SlaHours = new()
{
    { "Baixa", 24 },
    { "Média", 8 },
    { "Alta", 4 }
};
```

**⚪ Fila e Pilha** — Não são usadas explicitamente no código, mas conceitualmente os chamados abertos funcionam como uma **fila** (primeiro que chega, primeiro a ser atendido na ordem de criação).

**⚪ Árvore** — Não se aplica diretamente ao projeto. Seria usada em estruturas hierárquicas (ex: organograma de setores, categorias com subcategorias).

### Principais diferenças

```
Lista:    [A, B, C, D] — acessa qualquer posição, add/remove em qualquer lugar
Pilha:    [A, B, C, D← topo] — só add/remove no topo (LIFO)
Fila:     [frente →A, B, C, D] — add no fim, remove do início (FIFO)
Árvore:        A
              / \
             B   C    — hierárquica, busca eficiente O(log n)
            / \
           D   E
```

---

## 10. Roteiro para Apresentação

### ⏱️ Roteiro Sugerido (~15 min)

**1. Introdução (2 min)**
- "Este é o Ticket System, um sistema de gestão de chamados desenvolvido em C# com ASP.NET Core"
- Mostrar a tela de login rodando no browser
- Explicar o problema que resolve: gerenciar chamados de suporte com controle de SLA

**2. Arquitetura e Estrutura (2 min)**
- Mostrar a árvore de pastas: Models, Views, Controllers, Data, Migrations
- Explicar rapidamente o padrão MVC com o diagrama
- Destacar a separação: "Controllers recebem, Models processam, Views exibem"

**3. Demonstração ao Vivo (5 min)**
- **Login como Admin** → `/admin` → criar 2 usuários (1 Técnico, 1 Usuário)
- **Login como Usuário** → Criar um chamado com título, setor, prioridade e imagem
- **Login como Técnico** → Visualizar o chamado → Iniciar atendimento → Adicionar comentário → Finalizar com solução
- Mostrar o **SLA** estourado (se houver)
- Voltar ao dashboard e mostrar os **filtros** e **estatísticas**

**4. Código e POO (3 min)**
- Abrir `Ticket.cs` → Mostrar `private set` (encapsulamento)
- Mostrar `StartAttendance()` → Validação de regras de negócio
- Abrir `HomeController.cs` → Mostrar herança (`: Controller`)
- Abrir `AppDbContext.cs` → Mostrar `override OnModelCreating` (polimorfismo)

**5. Banco de Dados e Tecnologias (2 min)**
- Mostrar `appsettings.json` → connection string PostgreSQL
- Mostrar `Program.cs` → auto-migration
- Listar as tecnologias: .NET 10, EF Core, PostgreSQL, Bootstrap, jQuery

**6. Encerramento (1 min)**
- Recapitular: MVC, POO, Code-First, SLA, RBAC
- Abrir para perguntas

---

## 11. Lista Completa de Endpoints

### 🔐 Autenticação (`/api/auth`)

| # | Método | Endpoint | Descrição | Acesso |
|---|---|---|---|---|
| 1 | `POST` | `/api/auth/login` | Faz login e cria sessão | Público |
| 2 | `POST` | `/api/auth/logout` | Encerra sessão | Logado |
| 3 | `GET` | `/api/auth/me` | Retorna dados do usuário logado | Logado |
| 4 | `GET` | `/api/auth/users` | Lista todos os usuários | Admin |
| 5 | `POST` | `/api/auth/users` | Cria novo usuário | Admin |
| 6 | `PUT` | `/api/auth/users/{id}/toggle-active` | Ativa/desativa usuário | Admin |
| 7 | `PUT` | `/api/auth/users/{id}/role` | Altera role do usuário | Admin |
| 8 | `DELETE` | `/api/auth/users/{id}` | Remove usuário | Admin |
| 9 | `GET` | `/api/auth/users/{id}/name` | Retorna nome de um usuário | Logado |

### 🎫 Chamados (`/api/tickets`)

| # | Método | Endpoint | Descrição | Acesso |
|---|---|---|---|---|
| 10 | `POST` | `/api/tickets` | Cria novo chamado | Logado |
| 11 | `GET` | `/api/tickets` | Lista chamados (filtro por role) | Logado |
| 12 | `GET` | `/api/tickets/{id}` | Detalhe de um chamado | Logado |
| 13 | `PUT` | `/api/tickets/{id}/start` | Inicia atendimento | Logado |
| 14 | `PUT` | `/api/tickets/{id}/finish` | Finaliza com solução | Logado |
| 15 | `PUT` | `/api/tickets/{id}/cancel` | Cancela com justificativa | Logado |
| 16 | `GET` | `/api/tickets/{id}/comments` | Lista comentários do chamado | Logado |
| 17 | `POST` | `/api/tickets/{id}/comments` | Adiciona comentário (com imagem) | Logado |

### 🌐 Páginas (MVC Routes)

| # | Rota | View Renderizada | Descrição |
|---|---|---|---|
| 18 | `/` | `Auth/Login.cshtml` | Página de login |
| 19 | `/admin` | `Auth/AdminLogin.cshtml` | Login do admin |
| 20 | `/dashboard` | `Tickets/Index.cshtml` | Dashboard de chamados |
| 21 | `/admin/panel` | `Auth/AdminPanel.cshtml` | Painel de gestão de usuários |
| 22 | `/ticket/{id}` | `Tickets/Detail.cshtml` | Detalhes de um chamado |

> **Total: 17 endpoints de API + 5 rotas de página = 22 rotas**
