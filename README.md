# Contador de Folhas

Calcula o número de folhas de cartolina numa palete a partir da altura da pilha,
com base na espessura de cada cartolina (Base de dados de Cartolinas – Fornecedores).

Aplicação original desenvolvida por David Malheiro (artefacto Claude); esta versão foi adaptada para alojamento estático no GitHub Pages.

## Estrutura

```
index.html            Aplicação (HTML/CSS/JS num só ficheiro)
js/db-local.js        Substitui a base de dados do Claude por armazenamento no browser
data/cartolinas.json  Base de dados inicial (1103 cartolinas, importada a 15/10/2026)
.nojekyll             Diz ao GitHub Pages para servir os ficheiros tal como estão
```

## Publicar no GitHub Pages

1. Criar um repositório novo (ex.: `contador-de-folhas`).
2. Carregar todos os ficheiros desta pasta para a raiz do repositório (*Add file → Upload files*).
3. Em *Settings → Pages*, escolher *Deploy from a branch*, branch `main`, pasta `/ (root)`, e guardar.
4. Ao fim de 1–2 minutos a app fica em `https://<utilizador>.github.io/contador-de-folhas/`.

## Modo responsável

Os separadores **Pedidos** e **Base de dados** só aparecem em modo responsável:

- Ativar: abrir `.../contador-de-folhas/?admin=1` (fica memorizado nesse browser)
- Desativar: abrir `.../contador-de-folhas/?admin=0`

## Diferenças face à versão no Claude

- **Os dados ficam no browser de cada dispositivo** (localStorage). Uma importação de Excel
  ou um pedido feito num tablet não aparece noutro dispositivo.
- **Para atualizar a base de dados para todos:** substituir `data/cartolinas.json` no repositório.
  Os dispositivos que já abriram a app mantêm a cópia local até se limparem os dados do site
  (ou até se importar o Excel nesse dispositivo pelo separador *Base de dados*).
- Os pedidos continuam a poder ser enviados por email ("Abrir no email" / "Copiar mensagem"),
  que é a forma fiável de chegarem ao responsável nesta versão.
- Não há controlo de acesso: o modo responsável é só uma opção de interface.

Para partilhar dados entre dispositivos é preciso um backend (ex.: Firebase Firestore).
O `js/db-local.js` imita a mesma API (`collection`, `doc`, `onSnapshot`, `set`, `update`, `add`, `delete`),
pelo que basta trocar esse ficheiro, sem mexer no `index.html`.

## Formato de `data/cartolinas.json`

```json
{ "meta": { "versao": "...", "ficheiro": "...", "total": 1103, ... },
  "linhas": [[tipo, denominação, fornecedor, gramagem, gram. máx, gram. mín, espessura, esp. máx, esp. mín], ...] }
```
