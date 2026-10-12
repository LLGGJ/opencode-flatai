# FlatAI neste build

Este build do OpenCode expõe **somente a FlatAI** como provedor. O catálogo vem de
`packages/core/src/models-dev/snapshot.txt`, que lista a FlatAI e os 5 modelos da documentação oficial
(<https://flatai.pro/docs>). A atualização automática do catálogo externo está desligada
(`packages/core/src/models-dev.ts`, `fetch` padrão `false`) e os plugins de outros provedores não são registrados
(`packages/core/src/plugin/provider.ts`).

## Configuração

- URL-base (formato OpenAI): `https://api.flatai.pro/v1`
- Autenticação: `Authorization: Bearer <chave>` (a FlatAI também aceita `x-api-key`)
- Variável de ambiente: `FLATAI_API_KEY`
- A chave é exibida só na criação, em Painel → Chaves de API. Nunca a coloque em repositórios, logs ou capturas de tela.

Duas formas de informar a chave, sem editar arquivos:

```sh
export FLATAI_API_KEY="cole_sua_chave_aqui"   # variável de ambiente
opencode auth login                            # ou o fluxo de login, escolhendo FlatAI
```

## Modelos

| ID na API          | Nome             | Plano mínimo |
| ------------------ | ---------------- | ------------ |
| `z-ai/glm-5.3`     | GLM 5.3          | Basic        |
| `claude-sonnet-5`  | Claude Sonnet 5  | Basic        |
| `claude-opus-5-5`  | Claude Opus 5.5  | Pro          |
| `claude-fable-5.1` | Claude Fable 5.1 | Pro          |
| `gpt-6-astra`      | GPT-6 Astra      | Max          |

Um modelo fora do seu plano responde `403`. Limites por minuto: Basic 10, Pro 30, Max 50, Enterprise 300 (RPM).
Acima do limite a API segura a requisição em fila por até 1 minuto e depois responde `429` com `retry-after`.

## Pendências conhecidas (não verificado)

A documentação da FlatAI **não informa** estes dados, então os valores no catálogo são provisórios:

- Limite de contexto (`128000`) e de saída (`8192`) de cada modelo: valores conservadores, não oficiais.
- Suporte a chamada de ferramentas (`tool_call: true`) para todos os modelos: presumido pelo uso em agentes de
  código descrito na documentação, não confirmado por modelo.
- Parâmetros de esforço/raciocínio: nenhum documentado, por isso os modelos estão sem variantes de esforço.
- Custos: não informados, ficam zerados.

Ajuste esses campos em `snapshot.txt` quando a FlatAI publicar os valores. O endpoint `/v1/models` existe, mas ainda
não é usado para listar modelos automaticamente.
