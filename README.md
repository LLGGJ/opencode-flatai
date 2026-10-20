# opencode-flatai 🚀

CLI de programação com IA para terminal, baseada no OpenCode, com FlatAI e foco em Android/Termux.

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/LLGGJ/opencode-flatai)](https://github.com/LLGGJ/opencode-flatai)
[![GitHub Issues](https://img.shields.io/github/issues/LLGGJ/opencode-flatai)](https://github.com/LLGGJ/opencode-flatai/issues)

## 📌 Visão Geral

CLI de programação com IA para terminal, baseada no OpenCode, com FlatAI e foco em Android/Termux.

- **Linguagem Principal:** TypeScript
- **Branch Padrão:** `main`
- **Visibilidade:** Público

## ⚡ Começando Rápido (Linux/macOS)

**No Termux, comece pela seção [Android/Termux](#-androidtermux).**
Ela prepara o Debian e instala o Bun antes das dependências do projeto.

Requisitos: Git, Node.js com npm e **Bun 1.4.2** (versão de `packageManager`).
O monorepositório usa `catalog:` e `workspace:`, que o npm não resolve neste projeto.
Use Bun para instalar as dependências; `npm install` e `npm link` na raiz não são suportados.
Se o Bun ainda não estiver instalado no Linux/macOS, execute `npm install -g bun@1.4.2`
e confirme a instalação com `bun --version` antes de continuar.

```bash
git clone https://github.com/LLGGJ/opencode-flatai.git
cd opencode-flatai
# Instale as dependências com Bun
bun install --frozen-lockfile

# Registre o comando flatai com npm link
cd script/local-cli
npm link
cd ../..

# Inicie a CLI
flatai
```

### Disponibilizar o comando flatai com npm link

Após instalar as dependências com Bun, execute na raiz do clone:

```bash
cd script/local-cli
npm link
cd ../..
flatai --version
flatai --help
flatai
```

Essa pasta contém um pacote local sem dependências, para o npm registrar o comando
sem tentar instalar os workspaces. O comando executa o código deste clone com Bun
e preserva a pasta de onde você chamou `flatai`. Mantenha o clone no mesmo caminho.
A versão exibida ao executar pelo código-fonte é `local`.

Se você já havia feito o vínculo com o nome `opencode`, remova-o com
`npm uninstall -g opencode-flatai-local` e execute `npm link` novamente em
`script/local-cli` para registrar `flatai`.

Para remover o vínculo: `npm uninstall -g opencode-flatai-local`.

## 📱 Android/Termux

O projeto depende de Bun e módulos nativos para Linux. O ambiente Android do Termux
usa outra biblioteca de sistema (Bionic); os binários Linux não executam diretamente
nele. O caminho proposto é usar **Debian via proot-distro**, em aparelho com arquitetura
`aarch64`/`arm64` ou `x86_64`. Este procedimento ainda precisa de validação em um
aparelho real; a verificação deste repositório foi feita em Linux x64.

### Instalar pelo Termux

Se você já clonou o repositório, **atualize esse clone**. Não repita `git clone`
na mesma pasta. No Termux, execute:

```bash
cd ~/opencode-flatai &&
git pull --ff-only origin main &&
bash script/install-termux.sh
```

O instalador prepara o Debian, mantém um clone separado dentro dele, instala o Bun
na versão do projeto e depois instala as dependências e executa `npm link` em
`script/local-cli`. Se uma etapa falhar, ele para antes de anunciar sucesso.
A pasta `node_modules` da instalação interrompida no Android não é reutilizada.

Depois da instalação, abra a CLI **a partir do Termux** com:

```bash
proot-distro login debian -- flatai --standalone
```

O modo `--standalone` mantém o servidor junto da CLI nessa sessão do proot.
Para usar o comando `flatai` dentro do Debian:

```bash
proot-distro login debian
flatai --standalone
```

Clone na pasta pessoal do Debian; o armazenamento compartilhado do Android
(`/sdcard`) não oferece os links simbólicos e permissões exigidos.

### Atualizar uma instalação existente

Dentro do Debian, entre na pasta do clone e execute:

```bash
git pull --ff-only origin main &&
bun install --frozen-lockfile &&
(cd script/local-cli && npm link) &&
flatai --standalone
```

### Erros comuns

- **`destination path ... already exists`:** o clone já existe. Entre nele com
  `cd ~/opencode-flatai` e atualize com `git pull --ff-only origin main`.
- **`Bad system call (core dumped)`:** o Bun foi encerrado por uma chamada de
  sistema incompatível ou bloqueada no Android. Execute o instalador acima para
  tentar a instalação dentro do Debian. O proot usa o mesmo kernel do Android;
  se o erro persistir dentro dele, ainda há uma incompatibilidade do runtime
  com o aparelho e precisamos do erro dessa etapa para investigar.
- **`cd: script/local-cli: No such file or directory`:** seu clone está
  desatualizado. Atualize a `main` antes de tentar `npm link`.
- **`husky: not found` durante `npm link`:** o comando foi executado na raiz
  sem as dependências instaladas. Pare após a primeira falha e use o instalador;
  `npm link` deve executar somente dentro de `script/local-cli`.
- **`EUNSUPPORTEDPROTOCOL` / `Unsupported URL Type "catalog:"` ou `"workspace:"`:**
  instale com `bun install --frozen-lockfile` na raiz e execute `npm link` somente
  em `script/local-cli`.
- **`bun: command not found`:** execute o instalador acima; ele instala o Bun
  dentro do Debian, onde a CLI será executada.
- **`Exec format error` / binário existe, mas aparece `No such file or directory`:**
  confira se você está dentro do Debian, e se `uname -m` indica `aarch64` ou `x86_64`.
- **`Cannot find module 'react/jsx-dev-runtime'` / `Standalone server exited before reporting readiness`:**
  atualize o clone conforme os comandos acima. O lançador `flatai` prepara o OpenTUI
  tanto na interface quanto nos processos do servidor.
- **`flatai: command not found`:** execute `npm link` dentro do Debian e confira
  se `$(npm prefix -g)/bin` está no `PATH`.

Para obter detalhes da inicialização, execute `flatai --print-logs`.
Se persistir, envie o comando executado, o erro completo e as saídas de
`uname -m`, `node --version`, `npm --version` e `bun --version`.

## 🏷️ Lançamentos & Versões

As releases e tags deste repositório são geradas automaticamente a cada commit ou upload de ZIP via DevFlow Hub, mantendo o histórico de deploys sincronizado com o GitHub Actions.

---

_Gerado automaticamente via **DevFlow Hub** em 12/10/2026._
