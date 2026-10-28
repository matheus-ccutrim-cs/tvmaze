# Séries TVmaze — Checkpoint 3

Aplicativo desenvolvido com React Native e Expo para consultar séries e seus episódios por meio da API pública TVmaze. O projeto apresenta um catálogo de séries e permite acessar os episódios de cada título em uma segunda tela.

## Objetivos

- Aplicar o consumo de dados JSON de uma API REST.
- Utilizar `fetch` com `async/await` dentro de `useEffect`.
- Gerenciar dados, carregamento e erros com `useState`.
- Implementar navegação entre telas com Stack Navigator.
- Renderizar listas com `FlatList`.
- Tratar falhas de requisição e campos que podem conter valores nulos.
- Organizar componentes e telas de forma clara e reutilizável.

## Funcionalidades

### Catálogo de séries

Exibe as séries retornadas pela API, com imagem, nome e gêneros. Ao selecionar uma série, o aplicativo abre a tela de episódios, enviando seu identificador e nome como parâmetros de navegação.

### Episódios da série

Apresenta o nome da série selecionada e uma lista de episódios. Cada item informa temporada, número e nome, além da data de exibição e duração quando disponíveis.

### Carregamento e tratamento de erros

As duas telas exibem um `ActivityIndicator` durante a consulta. Em caso de falha, mostram uma mensagem e um botão para tentar novamente. O aplicativo também trata listas vazias, imagens ausentes ou com erro e campos opcionais. As requisições são canceladas quando a tela é desmontada.

## Tecnologias

| Tecnologia | Aplicação |
| --- | --- |
| React Native | Construção da interface |
| Expo SDK 55 | Ambiente de desenvolvimento e execução |
| JavaScript | Implementação da lógica |
| React Navigation / Native Stack | Navegação entre as telas |
| React Hooks | Gerenciamento de estado e efeitos |
| Fetch API | Requisições HTTP |
| React Native Web | Execução no navegador |

## Estrutura do projeto

```text
checkpoint3-tvmaze/
├── src/
│   ├── components/
│   │   └── RequestState.js
│   └── screens/
│       ├── ShowsScreen.js
│       └── EpisodesScreen.js
├── .gitignore
├── App.js
├── app.json
├── index.js
├── package.json
├── package-lock.json
└── README.md
```

| Arquivo | Responsabilidade |
| --- | --- |
| `App.js` | Configura o tema, o contêiner de navegação e as rotas do Stack Navigator. |
| `ShowsScreen.js` | Consulta e apresenta o catálogo de séries. |
| `EpisodesScreen.js` | Recebe os parâmetros da série e consulta seus episódios. |
| `RequestState.js` | Compartilha a interface de carregamento, erro e nova tentativa. |
| `index.js` | Registra o componente principal no Expo. |
| `app.json` | Define as configurações do aplicativo. |
| `package.json` | Declara dependências e comandos de execução. |
| `package-lock.json` | Registra as versões resolvidas das dependências. |
| `.gitignore` | Exclui dependências locais e arquivos gerados do controle de versão. |

## API utilizada

O aplicativo utiliza a [API pública TVmaze](https://www.tvmaze.com/api), sem necessidade de chave de acesso.

| Consulta | Endpoint |
| --- | --- |
| Catálogo de séries | `https://api.tvmaze.com/shows` |
| Episódios de uma série | `https://api.tvmaze.com/shows/{id}/episodes` |

A listagem consulta a primeira página do endpoint de séries. Na tela de detalhe, o `id` é obtido por `route.params` e inserido na URL com template literal:

```javascript
const { id, name } = route.params ?? {};
const response = await fetch(`https://api.tvmaze.com/shows/${id}/episodes`, {
  signal: controller.signal,
});
```

As consultas verificam o status HTTP e se o JSON retornado é uma lista. O fluxo utiliza `try/catch/finally` para tratar falhas e encerrar o estado de carregamento.

## Como executar

### Pré-requisitos

- Node.js 22 LTS ou superior e npm.
- Acesso à internet para consultar a API e carregar as imagens.
- Para execução nativa: Expo Go compatível com SDK 55 ou ambiente de desenvolvimento compatível.

### Instalação

Clone o repositório e abra a pasta que contém `package.json`. Instale as dependências:

```bash
npm ci
```

### Navegador

```bash
npm run web
```

### Expo

```bash
npm start
```

Utilize as opções exibidas no terminal para abrir o aplicativo no dispositivo ou emulador. No uso do Expo Go por rede local, mantenha o celular e o computador na mesma rede. As opções de compatibilidade do Expo Go estão disponíveis em [expo.dev/go](https://expo.dev/go).

### Outros comandos

```bash
npm run android
npm run ios
```

A execução em emuladores exige sua configuração prévia. O simulador de iOS requer macOS e Xcode.

## Verificação manual

- Abrir o catálogo e conferir imagens e nomes das séries.
- Selecionar uma série e conferir temporada, número e nome dos episódios.
- Voltar ao catálogo usando a navegação.
- Abrir uma tela sem conexão e conferir a mensagem de erro.
- Restaurar a conexão e utilizar o botão de nova tentativa.

## Contexto acadêmico

Projeto desenvolvido para o **Checkpoint 3 — Manipulação de dados JSON via API com React Native**, com foco em navegação, listas, Hooks e consumo de APIs.

## Créditos

Dados e imagens fornecidos pela [TVmaze](https://www.tvmaze.com/). O aplicativo utiliza os dados para fins acadêmicos.
