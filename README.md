# TopicosEspeciaisFront

Frontend do projeto **Cartola FC** — uma aplicacao React que exibe um campo de futebol visual com formacao 4-4-2, onde voce monta seu time adicionando jogadores nas posicoes.

Este projeto foi criado para a disciplina de Topicos Especiais, com foco em ensinar **deploy no Render via GitHub**.

---

## O que este projeto faz?

E a interface visual do montador de time. Ele se conecta a API backend (`TopicosEspeciaisApi`) e permite:

- Visualizar um campo de futebol com a formacao 4-4-2
- Ver os jogadores posicionados no campo (com foto, nome e idade)
- Clicar no "+" para adicionar um jogador em uma posicao vazia
- Editar ou remover jogadores existentes
- Ver o tecnico posicionado fora do campo

O campo ja vem carregado com a selecao brasileira do Penta 2002 (dados vindos da API).

---

## Estrutura do projeto

```
TopicosEspeciaisFront/
├── index.html                  # Pagina HTML raiz
├── package.json                # Dependencias e scripts npm
├── vite.config.js              # Configuracao do Vite (bundler)
├── render.yaml                 # Blueprint de deploy no Render
├── public/                     # Arquivos estaticos (favicon, etc.)
├── src/
│   ├── main.jsx                # Ponto de entrada — monta o React no DOM
│   ├── index.css               # Estilos globais (reset, fundo, fontes)
│   ├── App.jsx                 # Componente principal — gerencia estado e chamadas a API
│   ├── App.css                 # Estilos do App (header, loading, erro)
│   ├── components/
│   │   ├── Field.jsx           # Campo de futebol — layout com as 4 fileiras de jogadores
│   │   ├── Field.css           # Campo verde com linhas brancas (CSS puro)
│   │   ├── PlayerCard.jsx      # Card de cada jogador no campo
│   │   ├── PlayerCard.css      # Estilo do card (foto circular, nome, botoes)
│   │   ├── PlayerModal.jsx     # Modal para adicionar/editar jogador
│   │   ├── PlayerModal.css     # Estilo do modal (formulario dark)
│   │   ├── CoachCard.jsx       # Card do tecnico (fora do campo)
│   │   └── CoachCard.css       # Estilo do card do tecnico
│   └── services/
│       └── api.js              # Funcoes de comunicacao com o backend (fetch)
```

---

## Como rodar localmente

### Pre-requisitos

- [Node.js](https://nodejs.org/) instalado (versao 18 ou superior)
- O **backend** (`TopicosEspeciaisApi`) rodando em `http://localhost:5000`

### Passo a passo

```bash
# 1. Clone o repositorio
git clone https://github.com/SEU_USUARIO/TopicosEspeciaisFront.git
cd TopicosEspeciaisFront

# 2. Instale as dependencias
npm install

# 3. Rode o servidor de desenvolvimento
npm run dev
```

Pronto! O frontend vai abrir em **http://localhost:5173**.

> **Importante:** O backend precisa estar rodando antes! Abra outro terminal e rode `dotnet run` no projeto `TopicosEspeciaisApi`. Sem o backend, o frontend mostra um erro de conexao.

### Rodando os dois juntos

Abra **dois terminais**:

```bash
# Terminal 1 — Backend
cd TopicosEspeciaisApi
dotnet run
# → API rodando em http://localhost:5000

# Terminal 2 — Frontend
cd TopicosEspeciaisFront
npm run dev
# → Frontend rodando em http://localhost:5173
```

---

## Entendendo as configuracoes

### Variavel de ambiente — VITE_API_URL

Esta e a **unica configuracao** do frontend. Ela diz ao frontend onde a API backend esta rodando.

| Variavel       | Para que serve                          | Valor padrao              |
|----------------|-----------------------------------------|---------------------------|
| `VITE_API_URL` | URL base da API backend                 | `http://localhost:5000`   |

#### Como funciona?

No arquivo `src/services/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

- `import.meta.env.VITE_API_URL` — Le a variavel de ambiente que comeca com `VITE_`
- `|| 'http://localhost:5000'` — Se nao existir, usa o endereco local (para desenvolvimento)

#### Por que o prefixo VITE_?

O Vite so expoe variaveis de ambiente que comecam com `VITE_` no codigo do navegador. Isso e uma protecao de seguranca — impede que variaveis sensiveis do sistema (como senhas) vazem acidentalmente no frontend.

#### Quando configurar?

- **Localmente**: nao precisa fazer nada — o valor padrao `http://localhost:5000` ja funciona
- **No Render**: voce precisa configurar com a URL do backend deployado, ex: `https://topicos-especiais-api.onrender.com`

#### Importante: variavel de BUILD, nao de runtime

Diferente do backend, onde a variavel e lida quando a aplicacao roda, no frontend a variavel e substituida **durante o build** (`npm run build`). O Vite faz um "find and replace" no codigo, trocando `import.meta.env.VITE_API_URL` pelo valor real.

Isso significa: se voce mudar a variavel no Render, precisa **redesployar** (rodar o build de novo) para o valor atualizar.

---

## Entendendo os componentes

### App.jsx — O "cerebro"

E o componente principal. Ele:
1. **Busca os jogadores** da API quando carrega (`useEffect` + `getPlayers()`)
2. **Gerencia o estado** do time (lista de jogadores, modal aberto/fechado, jogador sendo editado)
3. **Repassa tudo** para os componentes filhos via props

### Field.jsx — O campo de futebol

Renderiza o campo verde com linhas brancas e posiciona os jogadores na formacao 4-4-2:

```
┌─────────────────────────────────────┐
│            MEU TIME                 │
│                                     │
│         [FWD]     [FWD]             │  ← Atacantes (slots 9-10)
│                                     │
│    [MID] [MID]  [MID] [MID]        │  ← Meio-campo (slots 5-8)
│                                     │
│    [DEF] [DEF]  [DEF] [DEF]        │  ← Defesa (slots 1-4)
│                                     │
│              [GK]                   │  ← Goleiro (slot 0)
│                                     │
└─────────────────────────────────────┘
        [COACH / Tecnico]              ← Fora do campo (slot 11)
```

As linhas do campo (circulo central, areas, etc.) sao feitas com **CSS puro** — elementos `div` posicionados com `position: absolute`, bordas brancas e `border-radius`.

### PlayerCard.jsx — Card do jogador

Tem dois estados:
- **Vazio**: mostra um botao "+" com a posicao (GK, DEF, etc.)
- **Preenchido**: mostra a foto circular, nome, idade e botoes de editar/remover

### CoachCard.jsx — Card do tecnico

Similar ao PlayerCard, mas com layout horizontal e posicionado fora do campo.

### PlayerModal.jsx — Modal de formulario

Abre quando voce clica para adicionar ou editar um jogador. Tem 3 campos:
- **Nome** (obrigatorio)
- **Idade** (obrigatorio, 1-99)
- **URL da foto** (opcional)

A posicao e o slot sao definidos automaticamente baseado em onde voce clicou no campo.

---

## Comunicacao com a API

O arquivo `src/services/api.js` contem 5 funcoes, uma para cada endpoint:

| Funcao            | Metodo HTTP | Endpoint               | Quando usa                   |
|-------------------|-------------|------------------------|------------------------------|
| `getPlayers()`    | GET         | `/api/players`         | Ao carregar a pagina         |
| `getPlayerById()` | GET         | `/api/players/{id}`    | (disponivel para uso futuro) |
| `createPlayer()`  | POST        | `/api/players`         | Ao adicionar jogador no "+"  |
| `updatePlayer()`  | PUT         | `/api/players/{id}`    | Ao salvar edicao             |
| `deletePlayer()`  | DELETE      | `/api/players/{id}`    | Ao clicar no "X" de remover  |

Todas usam `fetch` nativo do navegador (sem axios ou outras libs).

---

## Build de producao

Para gerar os arquivos estaticos otimizados:

```bash
npm run build
```

Isso cria uma pasta `dist/` com:
- `index.html` — HTML minificado
- `assets/index-XXXX.js` — JavaScript compilado e minificado
- `assets/index-XXXX.css` — CSS compilado e minificado

Esses sao os unicos arquivos necessarios para colocar o site no ar. Qualquer servidor que sirva arquivos estaticos (Nginx, Apache, Render Static Site, Netlify, Vercel) consegue rodar.

### Testando o build localmente

```bash
npm run build
npx vite preview
# → http://localhost:4173
```

---

## Deploy no Render

### O que e o render.yaml?

O `render.yaml` e um **Blueprint** — um arquivo que configura o deploy automaticamente quando voce conecta o repositorio no Render.

```yaml
services:
  - type: web               # Tipo de servico
    name: topicos-especiais-front  # Nome no painel do Render
    runtime: node            # Ambiente Node.js
    buildCommand: npm install && npm run build   # Comando executado no deploy
    startCommand: npx serve -s dist              # Comando que inicia o servidor
    branch: main             # Branch que dispara deploy
    envVars:
      - key: VITE_API_URL
        sync: false          # Configurado manualmente no painel
```

#### Entendendo cada campo:

- **type: web** — E um servico web (fica acessivel por URL)
- **runtime: node** — Diz ao Render que e um projeto Node.js
- **buildCommand** — O Render roda esse comando toda vez que faz deploy. Ele instala as dependencias e gera a pasta `dist/`
- **startCommand** — Depois do build, o Render executa esse comando para manter a aplicacao rodando. O `npx serve -s dist` sobe um servidor HTTP leve que serve os arquivos compilados. A flag `-s` ativa o modo SPA (redireciona rotas desconhecidas para `index.html`, necessario para React)
- **branch: main** — Qualquer push nessa branch dispara um novo deploy automatico
- **sync: false** — A variavel `VITE_API_URL` nao tem valor fixo no YAML. Voce define manualmente no painel do Render, porque a URL do backend so existe depois que ele for deployado

### Diferenca entre Static Site e Web Service

| Aspecto          | Static Site (Frontend)         | Web Service (Backend)           |
|------------------|-------------------------------|----------------------------------|
| O que serve?     | Arquivos HTML/CSS/JS prontos  | Uma aplicacao rodando (processo) |
| Precisa servidor?| Nao — o Render serve direto   | Sim — roda o container Docker    |
| Custo            | Gratis no Render              | Gratis (com limitacoes)          |
| Build            | `npm run build` → pasta dist  | Docker → container               |

O frontend e **estatico** porque depois do build, nao precisa de Node.js rodando. E so HTML, CSS e JavaScript que o navegador executa diretamente.

### Passo a passo para deploy (Static Site)

1. **Faca deploy do backend primeiro** — voce precisa da URL dele para configurar aqui
2. **Suba o codigo para o GitHub** — crie um repositorio e faca push da branch `main`
3. **Acesse o [Render](https://render.com)** e crie uma conta
4. **New > Static Site** — conecte o repositorio `TopicosEspeciaisFront`
5. O Render vai detectar o `render.yaml` e preencher as configuracoes automaticamente
6. Em **Environment Variables**, configure:
   - `VITE_API_URL` = URL do backend (ex: `https://topicos-especiais-api.onrender.com`)
7. Clique em **Create Static Site**
8. Aguarde o build (~1 minuto)

### Passo a passo para deploy (Web Service — alternativa)

Se voce escolheu **New > Web Service** em vez de Static Site, o Render vai pedir um **Start Command**. Isso acontece porque um Web Service precisa de um processo rodando para servir os arquivos, diferente do Static Site que o proprio Render serve automaticamente.

Nesse caso, preencha os campos assim:

| Campo             | Valor                                  |
|-------------------|----------------------------------------|
| **Build Command** | `npm install && npm run build`         |
| **Start Command** | `npx serve -s dist`                   |

#### O que e o Start Command e por que precisa dele?

No modo **Static Site**, o Render cuida de servir os arquivos HTML/CSS/JS para voce — nao precisa de nenhum processo rodando. E so apontar a pasta `dist/` e pronto.

No modo **Web Service**, o Render espera que **voce** rode um servidor. Ele te da uma maquina e diz: "me diz qual comando iniciar". Se voce nao informar, ele nao sabe o que fazer com a pasta `dist/`.

O comando `npx serve -s dist` faz o seguinte:

- **`npx`** — Executa um pacote npm sem precisar instalar globalmente
- **`serve`** — Um servidor HTTP simples e leve feito para servir arquivos estaticos
- **`-s`** — Modo SPA (Single Page Application). Quando alguem acessa uma rota que nao existe como arquivo (ex: `/about`), em vez de retornar 404, ele redireciona para o `index.html` e deixa o React resolver a rota. Sem isso, dar F5 em qualquer pagina que nao seja a raiz daria erro
- **`dist`** — A pasta com os arquivos compilados do `npm run build`

O `serve` automaticamente escuta na porta da variavel de ambiente `PORT` que o Render define, entao nao precisa configurar porta manualmente.

#### Qual escolher: Static Site ou Web Service?

| Aspecto                | Static Site                  | Web Service                    |
|------------------------|------------------------------|--------------------------------|
| Start Command          | Nao precisa                  | `npx serve -s dist`           |
| Quem serve os arquivos | O proprio Render (CDN)       | Um processo Node.js (serve)   |
| Performance            | Melhor (CDN otimizado)       | Boa (servidor simples)        |
| Plano gratuito         | Sim                          | Sim (com limitacoes de uso)   |
| Simplicidade           | Mais simples                 | Precisa de Start Command      |

**Recomendacao:** Use **Static Site** se disponivel. Use Web Service se o plano gratuito de Static Site nao estiver disponivel ou se voce precisar de mais controle.

### Deploy automatico

Assim como o backend, toda vez que voce fizer `git push` na branch `main`, o Render:
1. Roda `npm install && npm run build`
2. Substitui os arquivos na pasta `dist`
3. O site atualiza automaticamente

---

## Fluxo completo: do codigo ao usuario

```
Voce faz git push
       |
       v
  Render detecta mudanca na branch main
       |
       v
  Render roda: npm install && npm run build
       |
       v
  Gera a pasta dist/ com HTML + CSS + JS
       |
       v
  Render serve os arquivos via CDN
       |
       v
  Usuario acessa a URL do Render
       |
       v
  Navegador carrega o HTML e executa o JS
       |
       v
  React monta os componentes e chama GET /api/players
       |
       v
  Backend retorna os jogadores em JSON
       |
       v
  React renderiza o campo com os jogadores posicionados
```

---

## Duvidas comuns

**P: O frontend funciona sem o backend?**
R: Ele abre, mas mostra um erro "Erro ao carregar jogadores". O campo aparece vazio. Voce precisa do backend rodando para ver os jogadores.

**P: Por que Vite e nao Create React App?**
R: O Vite e mais rapido para desenvolvimento (hot reload quase instantaneo) e gera builds menores. O Create React App esta em modo de manutencao e nao e mais recomendado.

**P: Por que nao usar axios?**
R: O `fetch` nativo do navegador ja faz tudo que precisamos. Menos uma dependencia para instalar e manter.

**P: Preciso configurar algo para CORS?**
R: Nao, no frontend. O CORS e configurado no **backend**. O frontend so faz requisicoes normais — e o backend que decide se aceita ou nao.

**P: Posso deployar em outro lugar que nao o Render?**
R: Sim! Como e um site estatico, voce pode usar Netlify, Vercel, GitHub Pages, ou qualquer servidor que sirva HTML. So precisa configurar a variavel `VITE_API_URL` no build.

**P: Mudei a URL do backend, mas o frontend continua apontando para a antiga. Por que?**
R: Porque `VITE_API_URL` e substituida no **build**, nao em tempo de execucao. Voce precisa fazer um novo deploy (ou rodar `npm run build` novamente) para que a nova URL tenha efeito.
