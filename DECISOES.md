# Decisões, Justificativas e Aprendizado — GitHub Activity CLI

> Documento didático sobre as decisões de implementação deste projeto,
> os conceitos por trás delas, as alternativas consideradas, os problemas
> conhecidos e as práticas que valem a pena levar para a vida.

---

## Sumário

1. [Contexto: o que este projeto faz](#1-contexto)
2. [Como o código ficou organizado](#2-como-o-codigo-ficou-organizado)
3. [Decisões e justificativas](#3-decisoes-e-justificativas)
4. [Conceitos explicados](#4-conceitos-explicados)
5. [Opções consideradas (e por que não foram escolhidas)](#5-opcoes-consideradas)
6. [Autocrítica e problemas conhecidos](#6-autocritica-e-problemas-conhecidos)
7. [Soluções possíveis (próximos passos)](#7-solucoes-possiveis)
8. [Práticas ensinadas, como um professor](#8-praticas-ensinadas)
9. [Glossário rápido](#9-glossario-rapido)

---

## 1. Contexto

Este é um CLI (projeto do **roadmap.sh**, "GitHub Activity") que:

1. Recebe um nome de usuário do GitHub por argumento (`github-activity <username>`);
2. Consulta a API pública de eventos: `https://api.github.com/users/<username>/events`;
3. Resume a atividade recente no terminal, em frases legíveis.

A tabela de eventos tratados e a estratégia de resumo de cada um:

| Evento                          | Estratégia                     |
| ------------------------------- | ------------------------------ |
| `PushEvent`                     | Contar por repo                |
| `IssuesEvent`                   | Contar por repo + action       |
| `PullRequestEvent`              | Contar por repo + action       |
| `IssueCommentEvent`             | Contar por repo                |
| `CreateEvent`                   | Contar por repo + ref_type     |
| `DeleteEvent`                   | Contar por repo + ref_type     |
| `ReleaseEvent`                  | Contar por repo                |
| `WatchEvent`                    | **Individual** (Starred)       |
| `ForkEvent`                     | Contar total                   |
| `MemberEvent`                   | Contar por repo                |
| `CommitCommentEvent`            | Contar por repo                |
| `PullRequestReviewEvent`        | Contar por repo + action       |
| `PullRequestReviewCommentEvent` | Contar por repo                |
| `GollumEvent`                   | Contar pages por action        |
| `DiscussionEvent`               | Contar por repo                |
| `PublicEvent`                   | **Individual**                 |

> O modelo de saída (do enunciado do roadmap) é em linguagem natural:
>
> ```
> - Pushed 3 commits to kamranahmedse/developer-roadmap
> - Opened a new issue in kamranahmedse/developer-roadmap
> - Starred kamranahmedse/developer-roadmap
> ```

---

## 2. Como o código ficou organizado

```
src/
├── index.ts            → entrada: args, validação, fetch, chama processEvents
├── process_events.ts   → contagem (reduce) + formatação da saída
├── types.ts            → tipos (DTO) do GitHub
└── utils.ts            → validação de username e argumentos
```

Fluxo:

```
main() ──parseArgs──▶ validateUser/checkExtraInputs
        ──fetch──▶ getActivity() ──▶ processEvents(data)
                                      │
                                      ├─ countByRepo()        (reduces: repo → nº)
                                      ├─ countByRepoAndKey()  (reduces: repo → action → nº)
                                      └─ funções de impressão
```

---

## 3. Decisões e justificativas

### D1. Usar `reduce` para agregar contagens

O problema central era: *"quantas vezes X aconteceu em cada repo (e em cada action/ref_type)?"*.

`reduce` é a ferramenta ideal porque transforma um **array em um único valor acumulado** — exatamente
o que queremos: de `Post[]` para `{ repo: { action: número } }`.

```ts
function countByRepo(events: GitHubEvent[], eventType: GitHubEventType): RepoCount {
  return events
    .filter((e) => e.type === eventType)
    .map((e) => e.repo.name)
    .reduce((acc, name) => {
      acc[name] = (acc[name] ?? 0) + 1;
      return acc;
    }, {} as RepoCount);
}
```

O acumulador `acc` começa como `{}` (um objeto vazio) e, a cada iteração, ou cria a chave
(`acc[name] = 1`) ou incrementa (`acc[name] = acc[name] + 1`). O `?? 0` garante que, na primeira
vez que vemos um repo, `undefined` vira `0` antes do `+ 1`.

Por que não `for...of`? Porque `reduce` é **expressão** (retorna o valor) e comunica a intenção
"agregar" em uma linha, sem estado mutável espalhado fora do laço.

### D2. Dois helpers genéricos em vez de 16 funções

Olhando a tabela, quase todo evento se encaixa em **um de dois padrões**:

| Padrão | Forma |
| ------ | ----- |
| contar por repo | `{ repo: nº }` |
| contar por repo + chave | `{ repo: { action\|ref_type: nº } }` |

Então, em vez de escrever 16 funções quase idênticas (`processPushEvent`, `processIssueEvent`,
`processCreateEvent`, ...), criei **2 funções parametrizadas** pelo nome do evento:

```ts
countByRepo(events, 'ReleaseEvent');          // mesmo código para qualquer evento "por repo"
countByRepoAndKey(events, 'CreateEvent', 'ref_type'); // mesmo código para qualquer "repo + chave"
```

Isso é **DRY (Don't Repeat Yourself)**: a regra de negócio (contar) existe **uma vez**, e os 16
casos viram apenas 16 *chamadas* no final de `processEvents` (`src/process_events.ts:84-163`).

**Custo consciente**: a flexibilidade custa um pouco de legibilidade (parâmetros a mais). A
alternativa (16 funções) seria mais óbvia, porém repetitiva e com 16 lugares para corrigir um bug.

### D3. Separar contagem de apresentação

Os helpers de contagem **retornam dados** (`RepoCount` / `RepoKeyCount`) e não imprimem nada.
Quem imprime são `printRepoCounts` / `printRepoKeyCounts`, que recebem uma função `format`
(função de alta ordem — *callback*):

```ts
printRepoCounts(countByRepo(events, 'PushEvent'), (repo, count) =>
  `- Pushed ${count} time${count === 1 ? '' : 's'} to ${repo}`
);
```

**Motivos**:
- *Separation of concerns*: cálculo e exibição mudam por razões diferentes.
- O mesmo contador pode ser reutilizado com outro formato amanhã (JSON, tabela, CSV).
- Fica fácil **testar** a contagem sem capturar `console.log`.

### D4. Saída em linguagem natural

O modelo do roadmap é frases naturais: `- Opened a new issue in repo`. Então a formatação usa
tabelas de "frases" (`ISSUE_PHRASES`, `PR_PHRASES`, `REF_TYPE_PHRASES`) em vez de um template
cru `"${evento} ${action} ${count} vezes"`:

```ts
const ISSUE_PHRASES: Record<string, (count: number) => string> = {
  opened: (n) => (n === 1 ? 'a new issue' : `${n} new issues`),
  closed: (n) => (n === 1 ? 'an issue' : `${n} issues`),
};
```

Assim, uma action desconhecida ainda tem um fallback (`src/process_events.ts:94`):

```ts
return `- ${capitalize(action)} ${count} issue${count === 1 ? '' : 's'} in ${repo}`;
```

### D5. WatchEvent (Starred) vira saída individual

Starred é um evento que "vale por si só" — ninguém quer ler `Starred 5 times to repo`.
Como uma estrela é um destaque, cada ocorrência vira uma linha:

```ts
for (const e of events.filter((e) => e.type === 'WatchEvent')) {
  console.log(`- Starred ${e.repo.name}`);
}
```

Mesmo raciocínio para `PublicEvent` (`- Made <repo> public`). A estratégia da tabela muda por
**caso de uso da leitura humana**, não por preguiça de implementação.

### D6. PushEvent mantém contagem sem request extra

O modelo original diz `Pushed 3 commits to repo`. Para saber o nº de *commits* (não de pushes),
precisaríamos buscar cada evento `/repos/<repo>/commits` — um request a mais por repo. Decisão:
**não**. Mantemos `Pushed 3 times to repo` usando apenas o array que já temos.

**Justificativa** (a pedido do usuário, e com razão técnica):
- **Latência**: cada request sequencial custa ~100–300ms; com 10 repos, +1–3s.
- **Rate limit**: sem token, a API pública permite ~60 requests/hora por IP. Cada request extra
  gasta o orçamento e pode derrubar o CLI com `403`.
- **Princípio YAGNI**: a informação ("3 commits") não vale o custo de buscá-la aqui.

Esse é um exemplo clássico de *trade-off*: o resultado perfeito (commits) versus o resultado
bom e barato (pushes).

### D7. Refatoração de `types.ts`

O type original tinha problemas (autocrítica do código anterior):

| Problema                                | Solução                                       |
| --------------------------------------- | --------------------------------------------- |
| Nome `Post` (genérico, sem semântica)   | `GitHubEvent`                                 |
| Um bloco gigante de campos               | Sub-interfaces: `GitHubActor`, `GitHubRepo`, `GitHubPayload`, `GitHubWikiPage` |
| `id` tipado como `number` (API devolve string) | `id: string`                          |
| `type: string` (qualquer string)        | `type: GitHubEventType` (união dos 16 eventos) |
| Campos obrigatórios que a API não garante | `action?`, `ref?`, `ref_type?`, `pages?`, ... |
| Nada imutável                           | `readonly` em todos os campos                 |
| Type `Events` morto, não usado           | Removido (dead code)                          |

Cada item é explicado em detalhe na seção de conceitos/práticas abaixo.

### D8. `??` em vez de `||`

Em `acc[name] = (acc[name] ?? 0) + 1`, usei `??` (nullish coalescing) e não `||` (OR lógico).

- `a || 0` usa `0` quando `a` é *falsy*: `0`, `''`, `NaN`, `null`, `undefined`, `false`.
- `a ?? 0` usa `0` **apenas** quando `a` é `null` ou `undefined`.

Para contagens, ambos funcionam (contagem nunca é `''`). Mas se amanhã o valor fosse `0`
(válido), `||` trocaria por `0` de novo (ok), e se fosse `false`... enfim: **`??` expressa a
intenção correta** ("se não existe, use 0") sem os efeitos colaterais de `||` com outros valores
falsy. Boa prática: preferir `??` para "padrão quando ausente".

---

## 4. Conceitos explicados

### 4.1 `filter` → `map` → `reduce` (pipeline)

Um pipeline de array é uma cadeia de transformações, onde a saída de uma é a entrada da outra:

```ts
events
  .filter((e) => e.type === 'PushEvent')  // 1) seleciona só o que interessa
  .map((e) => e.repo.name)                // 2) transforma: extrai o nome do repo
  .reduce((acc, name) => { ... }, {});    // 3) agrega: contagens
```

- `filter`: reduz o array pelos elementos que satisfazem um predicado.
- `map`: transforma cada elemento (mesmo tamanho de array).
- `reduce`: "espreme" o array em um único valor.

Cada etapa faz **uma coisa só** e é legível em voz alta: *"filtra pushes, extrai o nome,
conta por nome"*.

### 4.2 `reduce` com objeto como acumulador

A assinatura de `reduce`:

```ts
arr.reduce((acc, item, index, array) => novoAcc, valorInicial)
```

O truque de "contar com objeto" funciona porque objetos em JS são **tabelas chave → valor**:

```ts
{}                 // começa vazio
{ "a": 1 }         // 1ª vez que vê "a"  → acc["a"] = (undefined ?? 0) + 1
{ "a": 2 }         // 2ª vez que vê "a"  → acc["a"] = (1 ?? 0) + 1
{ "a": 2, "b": 1 } // 1ª vez que vê "b"
```

O segredo é que **a chave é o valor que estamos contando** (o nome do repo), e o **valor é a
contagem**.

### 4.3 `Record<K, V>` e index signatures

```ts
type RepoCount = Record<string, number>;
```

`Record<string, number>` é açúcar para uma *index signature*: `{ [key: string]: number }`.
Significa: "um objeto cujas chaves são strings e cujos valores são números".

```ts
type RepoKeyCount = Record<string, RepoCount>; // { repo: { action: nº } }
```

É um tipo **aninhado** que espelha exatamente a estrutura que o usuário pediu no começo:
*"quero ter `repoName: { action: count }`"*.

### 4.4 `Object.entries` + destructuring

```ts
for (const [repo, count] of Object.entries(counts)) {
  ...
}
```

`Object.entries({ a: 1, b: 2 })` devolve `[["a", 1], ["b", 2]]`. O destructuring `[repo, count]`
separa chave e valor na própria declaração do `for`. É a forma moderna e segura de iterar objetos
(com `for...in` precisaríamos de `hasOwnProperty` e o tipo fica `string`, não `[string, number]`).

### 4.5 `??` (nullish coalescing) vs `||`

Explicado em D8. Regra prática:

| Expressão | `a` é `null/undefined` | `a` é `''` | `a` é `0` |
| --------- | ---------------------- | ---------- | --------- |
| `a ?? 0`  | `0`                    | `''`       | `0`       |
| `a \|\| 0`| `0`                    | `0`        | `0`       |

Para "padrão se ausente" → `??`. Para "padrão se falsy" → `||`.

### 4.6 `flatMap` (usado no Gollum)

```ts
.flatMap((e) => e.payload.pages ?? [])
```

`GollumEvent` traz um **array de páginas por evento** (`payload.pages`). Preciso **achatar**:
juntar todos os arrays de todos os eventos em um só array de páginas antes de contar.
`flatMap` = `map` + "achate uma camada", e ainda já trata o `?? []` (evento sem `pages` vira
array vazio). Sem isso, eu teria um array de arrays e `reduce` contaria "arrays" em vez de páginas.

### 4.7 `readonly`

```ts
readonly id: string;
```

`readonly` promete: "depois de criado, esse campo não muda". Para dados que **vêm de fora**
(resposta de API) isso é semanticamente correto — não faz sentido o código mutar um evento
recebido. O compilador passa a **impedir** atribuições como `event.id = 'x'`. É documentação
executável: o tipo conta a história do dado.

### 4.8 Union types (tipos união)

```ts
export type GitHubEventType =
  | 'PushEvent'
  | 'IssuesEvent'
  | ...;
```

`type` deixa de ser "qualquer string" e passa a ser "uma destas 16". O TypeScript agora **valida**
comparações e parâmetros. Se alguém escrever `countByRepo(events, 'PushEvent')` → ok.
`countByRepo(events, 'PullEvent')` → erro de compilação. Erros que antes só apareceriam em
runtime, agora aparecem no editor.

### 4.9 Campos opcionais (`?`) e `exactOptionalPropertyTypes`

```ts
readonly action?: string;  // pode ou não existir
```

A API do GitHub **não envia os mesmos campos em todos os eventos** (Push não tem `action`,
Gollum não tem `ref_type`). Tipar como obrigatório seria uma mentira; o TypeScript trataria como
sempre presente e você quebraria em runtime. Opcional = "o dado pode não vir".

O `tsconfig.json` tem `exactOptionalPropertyTypes: true`, que é o modo **mais rigoroso**: você não
pode *atribuir* `undefined` a um campo opcional (tem que omiti-lo), evitando bugs sutis de estado.

O código lida com a ausência em 3 pontos:
- `e.payload[key] ?? 'unknown'` → chave ausente vira a string `'unknown'`;
- `e.payload.pages ?? []` → array ausente vira `[]`;
- `acc[name] ?? 0` → repo ainda não contado vira `0`.

### 4.10 `noUncheckedIndexedAccess`

Opção ativa no `tsconfig`. Ela faz o acesso por índice (`acc[name]`, `arr[i]`) retornar
`T | undefined` em vez de `T`, porque "o índice pode não existir". É por isso que o código precisa
de `?? 0` em todo acesso — **de propósito**: o compilador nos obriga a tratar o caso "não existe".

### 4.11 Higher-order functions (callbacks de formatação)

`printRepoCounts(counts, format)` recebe uma função. Isso é uma *higher-order function* (função que
recebe/retorna função). Cada chamada passa um `format` diferente, então a impressão é genérica e
a mensagem específica. É o mesmo padrão que `Array.map(fn)`, `filter(fn)` etc.

### 4.12 Cast `as GitHubEvent[]`

```ts
const data: GitHubEvent[] = (await res.json()) as GitHubEvent[];
```

`as` é um "eu sei o que estou fazendo": diz ao TS que o `unknown` retornado pelo `json()` é um
`GitHubEvent[]`. **Atenção**: cast não valida nada em runtime — se a API mandar outra coisa, o
TS não nos salva. Isso é um risco conhecido (ver autocrítica, seção 6).

---

## 5. Opções consideradas

### O1. `reduce` vs `for...of`

| | `reduce` | `for...of` |
| --- | --- | --- |
| Retorna valor direto | Sim (é expressão) | Não (precisa de variável externa) |
| Estado mutável | Local ao acumulador | Variável `let` externa |
| Leitura | Uma expressão encadeada | Passo a passo imperativo |
| Curva de aprendizado | Maior | Menor |

Escolhi `reduce` porque é o foco do exercício, é expressivo e evita estado mutável solto. A troca
é justa: quem ainda não domina `reduce` acha `for...of` mais fácil de ler — por isso esta seção
de conceitos existe.

### O2. Chave plana `"repo:action"` vs objeto aninhado

Alternativa que evita o objeto de 2 níveis:

```ts
const count = {};            // chave "user/repo:opened"
count[`${repo}:${action}`] = (count[`${repo}:${action}`] ?? 0) + 1;
```

**Por que não**: (a) fica feio para imprimir (precisaria fazer `split(':')`); (b) a chave é uma
"concatenação de dados", frágil se `repo` ou `action` contiverem `:`; (c) o usuário pediu
explicitamente `repoName: { action: count }`. O aninhado modela o domínio, o plano é um truque
de "encoding".

### O3. `Map` vs objeto plano

```ts
const m = new Map<string, number>();
```

`Map` é mais seguro (sem `__proto__`), tem tamanho (`m.size`) e iteração nativa. **Por que não**:
o objeto plano é mais simples, o JSON de entrada/saída é objeto, e `Record<K,V>` casa com a
cultura de objetos em JS. Para contagens pequenas, a diferença de segurança é baixa — mas veja o
risco na seção 6.

### O4. 16 funções vs 2 genéricas

Discutido em D2. Vencedor: genéricas (DRY).

### O5. Um type gigante vs sub-interfaces

Vencedor: sub-interfaces (D7). Tipo grande = difícil de ler, difícil de reusar (`GitHubActor`
pode ser usado sozinho), diffs gigantes.

### O6. Interface única vs união discriminada (discriminated union)

A "opção de ouro" seria um type por evento:

```ts
interface PushEvent { type: 'PushEvent'; payload: { ref: string; ... } }
interface IssuesEvent { type: 'IssuesEvent'; payload: { action: 'opened' | 'closed'; ... } }
type GitHubEvent = PushEvent | IssuesEvent | ...;
```

Aí o TS saberia que, se `e.type === 'PushEvent'`, o payload tem `ref`, e que `e.payload.action`
**não existe** em Push (erro em tempo de compilação). **Por que não agora**: o código atual indexa
`e.payload[key]` de forma genérica — com a união discriminada isso exigiria reescrever
`process_events.ts` com narrowing/casts por evento, um refactor bem maior. Deixei como melhoria
futura (seção 7).

### O7. Buscar nº de commits por push (request extra)

Descartado por latência/rate limit (D6).

---

## 6. Autocrítica e problemas conhecidos

Sendo honesto: **não está perfeito**, e é importante saber onde.

### P1. Cast sem validação (dados externos não verificados)

`(await res.json()) as GitHubEvent[]` confia na API sem validar. Se a resposta vier com formato
inesperado (campo ausente, tipo diferente), o erro aparecerá em runtime, não no compilador.
→ Solução: validação com **zod** (seção 7).

### P2. Complexidade de eficiência: N×M passes

`processEvents` chama `countByRepo`/`countByRepoAndKey` **uma vez por tipo de evento**. Cada call
re-filtra o array inteiro: 16 tipos ⇒ até 16 varreduras em N eventos = O(16·N). Para 30 eventos
é irrelevante, mas o padrão não escala.
→ Solução: um único passe agrupando por `type` (Map), depois extrair contagens.

### P3. Nome `countGollumPages` reusa `RepoCount`

`countGollumPages` retorna `RepoCount` (nome diz "por repo"), mas na verdade é `{ action: nº }`.
Nome enganoso — o tipo funciona, o nome não conta a história certa.
→ Solução: alias `type KeyCount = Record<string, number>` para usar nos dois lugares.

### P4. Prototype pollution (chaves perigosas em objeto plano)

Se um `repo` se chamasse `__proto__` ou `constructor`, `acc[name] = ...` em objeto plano poderia
ter comportamento inesperado (ex.: sobrescrever herança). Improvável aqui (nomes vêm do GitHub),
mas é um risco real de `{}` como mapa.
→ Soluções: `Map`, `Object.create(null)`, ou checar `Object.hasOwn(acc, name)`.

### P5. `Object.entries` devolve `[string, ...]` — perdemos tipo da chave

`for (const [repo, count] of Object.entries(counts))` tipa `repo` como `string`, não como algo
mais restrito. Aceitável — objeto plano não guarda tipo por chave.

### P6. Pluralização genérica pode gerar erro de inglês

O fallback `(n) => \`${n} ${refType}s\`` produziria `repositorys` (errado; o certo é
`repositories`). Cobrei os casos comuns (`branch`, `tag`, `repository`), mas um `ref_type` novo
quebraria a gramática.
→ Solução: tabela de plurais ou `Intl.PluralRules`.

### P7. Bug pré-existente no `index.ts` (não introduzido, mas visto)

```ts
throw new Error(`Requisition error: {res.status}`);
```

Aqui as chaves `{res.status}` estão **dentro da template string literal** — imprime o texto
`{res.status}`, não o status. O certo: `Requisition error: ${res.status}`.
→ Vale corrigir.

### P8. `try/catch` + `process.exit` duplicados

`main()` e `getActivity()` fazem `try/catch` com o mesmo `console.error` + `exit(1)`. Redundância
que dificulta mudanças (ex.: querer testes que não saiam do processo).
→ Solução: centralizar erro em `main` e fazer `getActivity` só lançar.

### P9. Saída agrupada por tipo, não cronológica

Imprimimos "todos os Pushes, depois todos os Issues, ...". A ordem cronológica se perde. Para um
resumo agregado tudo bem; para "feed de atividade" não seria.
→ Solução: iterar eventos em ordem de `created_at` imprimindo um resumo por evento.

### P10. Sem dedup nem paginação

A API `/events` devolve no máximo 30 eventos e **não** paginamos (o GitHub recomenda passar por
páginas). Sem dedup por `id`, eventos repetidos (se paginarmos) duplicariam a contagem.

### P11. `as` com tipo `GitHubEventType` — o que acontece se a API mandar outro tipo?

Se um evento vier com `type: 'MilestoneEvent'` (fora da união), o cast faz o dado "caber" no
tipo — e o `filter` simplesmente ignora, pois nenhum helper procura por ele. Não quebra, mas
"some" silenciosamente.

### P12. Diferença `Pushed ... times` vs modelo `Pushed ... commits`

Consciente e aceita (D6). O usuário preferiu velocidade/rate limit à exatidão.

---

## 7. Soluções possíveis

Priorizadas por impacto × esforço:

| # | Melhoria | Esforço | Impacto |
| --- | --- | --- | --- |
| 1 | Corrigir `{res.status}` (P7) e centralizar erros (P8) | Baixo | Alto |
| 2 | Renomear tipo de `countGollumPages` (P3) | Baixo | Médio |
| 3 | Single-pass: agrupar por tipo uma vez (P2) | Médio | Alto (em escalas) |
| 4 | Validar resposta com **zod** (P1) | Médio | Alto (robustez) |
| 5 | União discriminada por evento (O6) | Alto | Muito alto (type safety) |
| 6 | `Map`/`Object.create(null)` (P4) | Baixo | Médio |
| 7 | Token via `GITHUB_TOKEN` + paginação `per_page=100` (P10) | Médio | Alto (funcional) |
| 8 | Dedup por `id` (P10) | Baixo | Médio |
| 9 | Testes com `node:test` | Médio | Alto |
| 10 | `Intl.PluralRules` para pluralização (P6) | Baixo | Baixo |

### Exemplo — validação com zod (P1/P4/P5)

```ts
import { z } from 'zod';

const Repo = z.object({ name: z.string() });
const Payload = z.object({ action: z.string().optional() }).passthrough();

const EventSchema = z.object({
  id: z.string(),
  type: z.enum(['PushEvent', 'IssuesEvent', /* ... */]),
  repo: Repo,
  payload: Payload,
});

const data: GitHubEvent[] = z.array(EventSchema).parse(await res.json());
```

Agora sim: resposta validada em runtime, sem `as` mentiroso, sem `__proto__` malicioso.

---

## 8. Práticas ensinadas

Aqui está a "aula" — os princípios que usei, e **por que** são boas práticas.

### 8.1 Pense em pipelines, não em laços

Antes de escrever um `for`, pergunte: "é um *filtro*? uma *transformação*? uma *agregação*?".
Se sim, `filter`/`map`/`reduce` dizem a intenção num olhar. Seu código vira uma frase:
*filtra → extrai → conta*.

> 🎓 **Como treinar**: pegue qualquer `for` seu e tente reescrever com métodos de array. Repita
> até ser automático.

### 8.2 `reduce` = "transformar array em um único valor"

Decore esta forma e ela aparece em todo lugar (somar, agrupar, contabilizar, montar objeto):

```ts
arr.reduce((acc, item) => {
  // usar item para atualizar acc
  return acc;
}, valorInicial);
```

**A regra de ouro**: o acumulador é o *resultado parcial*. Comece com o valor neutro (`0` para
soma, `{}` para agrupamento) e a cada passo devolva o acumulador atualizado.

> 🎓 **Dica de depuração**: dentro do `reduce`, coloque `console.log(acc)` para ver o acumulador
> "crescendo" a cada passo. Ver a transformação ao vivo vale mais que qualquer explicação.

### 8.3 DRY (Don't Repeat Yourself)

Se o mesmo padrão aparece 3+ vezes, generalize. Aqui, 16 eventos → 2 helpers + 16 chamadas.
Regra prática: **3 strikes e você generaliza**.

Custo consciente: generalizar pode "esconder" a lógica. Por isso o helper precisa de **bom nome**
e **parâmetros que contem o que varia**.

### 8.4 Separe "calcular" de "mostrar"

Funções que calculam → retornam dados, não imprimem. Funções que mostram → recebem dados e uma
"forma" (callback `format`). Benefícios: testável, reutilizável, e cada função tem um motivo
único para mudar (Single Responsibility).

### 8.5 Nomes semânticos contam a história

`Post` → `GitHubEvent`, `countByRepoAndKey`, `printRepoCounts`, `ISSUE_PHRASES`. Um bom nome
elimina a necessidade de comentários. Se você precisa de comentário para explicar *o que* a
função faz, o nome está ruim (mude o nome).

### 8.6 O tipo deve refletir a realidade dos dados

Se a API nem sempre manda `action`, o campo é **opcional**. Se um tipo pode ser só 16 valores,
use **união de literais**. Mentir para o compilador (`action: string` obrigatório) só adia o erro
para runtime.

> Regra: **o código é tão seguro quanto o tipo for honesto.**

### 8.7 `readonly` para dados que vêm de fora

DTOs (Data Transfer Objects — dados de resposta de API) são imutáveis por natureza. `readonly`
transforma isso em garantia do compilador.

### 8.8 Faça o compilador trabalhar para você

O `tsconfig` deste projeto já liga `strict`, `noUncheckedIndexedAccess` e
`exactOptionalPropertyTypes`. Eles "incomodam" (forçam `??`, `?? []`, etc.), e é exatamente esse
o ponto: **o incômodo em tempo de compilação é bug que não chega ao runtime**. Não desligue essas
opções — aprenda a conviver com elas.

### 8.9 `??` para "padrão se ausente", `||` para "padrão se falsy"

Minúsculo, mas evita bugs clássicos (ex.: `name || 'guest'` trocando `''` por `'guest'`).

### 8.10 Itere objetos com `Object.entries`

`Object.entries` + destructuring é mais seguro que `for...in` (evita propriedades herdadas) e
mais limpo. Use `for...in` apenas quando quiser *herança incluída* — quase nunca.

### 8.11 Trade-offs são decisões de projeto, não falhas

Não buscar commits por push (D6), aceitar N passes (P2), frases que não cobrem todo plural (P6):
todas escolhas conscientes com motivo documentado. **Bom engenheiro documenta o *porquê* do
trade-off**, para o próximo (e o eu do futuro) não "consertar" sem entender o contexto.

### 8.12 Autocrítica é prática, não humildade falsa

A seção 6 existe para deixar explícito: conheço as fraquezas, sei o custo delas e tenho um plano
de prioridades (seção 7). Código sem autocrítica documentada envelhece mal: ninguém sabe o que
era intencional e o que era descuido.

> 🎓 **Exercício final**: pegue cada item da seção 6 e tente implementar a correção na ordem da
> seção 7. Comece pelos de esforço baixo (#1 e #2) — são 15 minutos de trabalho e melhoram o
> código na hora.

---

## 9. Glossário rápido

| Termo | Significado |
| --- | --- |
| **reduce** | Método de array que agrega todos os elementos em um único valor. |
| **acumulador** | Valor parcial que o `reduce` carrega entre iterações. |
| **pipeline** | Cadeia de transformações de array (`filter → map → reduce`). |
| **index signature** | Forma de tipar "objeto com chaves dinâmicas": `Record<string, number>`. |
| **nullish coalescing (`??`)** | Operador: "use o da direita se o da esquerda for `null`/`undefined`". |
| **optional chaining (`?.`)** | Acessar propriedade sem erro se o caminho for `null`/`undefined`. |
| **flatMap** | `map` que achata uma camada de arrays. |
| **higher-order function** | Função que recebe ou retorna outra função. |
| **union type** | Tipo que é "um destes valores/tipos". |
| **discriminated union** | União de objetos distinguidos por um campo literal (ex.: `type`). |
| **DTO** | Data Transfer Object: shape de dados trocado entre sistemas (API ↔ app). |
| **cast (`as`)** | Afirmação manual de tipo, sem validação em runtime. |
| **dead code** | Código que não é usado por ninguém; deve ser removido. |
| **DRY** | Don't Repeat Yourself — não repita a mesma lógica. |
| **YAGNI** | You Aren't Gonna Need It — não implemente o que não precisa agora. |
| **rate limit** | Limite de requisições por tempo; GitHub sem token: ~60/hora por IP. |
