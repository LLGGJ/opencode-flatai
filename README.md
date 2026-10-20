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

No Termux:

```bash
pkg update
pkg install proot-distro
proot-distro install debian
proot-distro login debian
```

Se o Debian já estiver instalado, basta executar `proot-distro login debian`.

**Não execute `bun install` no Termux antes de entrar no Debian e instalar o Bun.**
A mensagem `No command bun found` indica que esse terminal ainda não encontra o
Bun; repetir `bun install` não instala o runtime.

Dentro do Debian (inclusive para os próximos comandos):

```bash
apt update
apt install -y git curl ca-certificates unzip nodejs npm build-essential python3
npm install -g bun@1.4.2
bun --version

git clone https://github.com/LLGGJ/opencode-flatai.git
cd opencode-flatai
bun install --frozen-lockfile
cd script/local-cli
npm link
cd ../..
flatai --version
flatai --help
flatai
```

Nas próximas sessões, entre novamente com `proot-distro login debian` antes de usar
`flatai`. Clone na pasta pessoal do Debian; o armazenamento compartilhado do
Android (`/sdcard`) não oferece os links simbólicos e permissões exigidos.

### Erros comuns

- **`EUNSUPPORTEDPROTOCOL` / `Unsupported URL Type "catalog:"` ou `"workspace:"`:**
  instale com `bun install --frozen-lockfile` na raiz e execute `npm link` somente
  em `script/local-cli`.
- **`bun: command not found`:** instale a versão indicada acima dentro do Debian e
  confira `bun --version` na mesma sessão.
- **`Exec format error` / binário existe, mas aparece `No such file or directory`:**
  confira se você está dentro do Debian, e se `uname -m` indica `aarch64` ou `x86_64`.
- **`flatai: command not found`:** execute `npm link` dentro do Debian e confira
  se `$(npm prefix -g)/bin` está no `PATH`.

Se persistir, envie o comando executado, o erro completo e as saídas de
`uname -m`, `node --version`, `npm --version` e `bun --version`.

## 🏷️ Lançamentos & Versões

As releases e tags deste repositório são geradas automaticamente a cada commit ou upload de ZIP via DevFlow Hub, mantendo o histórico de deploys sincronizado com o GitHub Actions.

---

_Gerado automaticamente via **DevFlow Hub** em 12/10/2026._
