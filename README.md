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

## ⚡ Instalar e iniciar (Linux)

Requisitos: Linux com glibc (Debian/Ubuntu), x64 ou arm64, Node.js 18+,
npm e Git. Não é necessário clonar o repositório nem instalar Bun.

```bash
npm install -g github:LLGGJ/opencode-flatai
flatai --version
flatai --help
flatai
```

O npm registra `flatai`. Na primeira execução, o lançador baixa o executável
compilado da release correspondente e verifica seu SHA-256; as próximas
execuções reutilizam esse arquivo. A primeira execução precisa acessar GitHub Releases.
Esta distribuição contém a interface de terminal e o servidor API; não inclui a
interface web. macOS, Windows, Alpine/musl e Android nativo ainda não têm
binários nesta distribuição.

Para atualizar ou remover:

```bash
npm install -g github:LLGGJ/opencode-flatai
# ou: flatai upgrade
npm uninstall -g flatai
```

## 📱 Android/Termux

O binário depende de glibc e não funciona diretamente no Android/Bionic.
Instale dentro do Debian via proot, sem clonar o projeto:

```bash
pkg update
pkg install proot-distro
proot-distro install debian
proot-distro login debian
apt-get update
apt-get install -y nodejs npm git ca-certificates
npm install -g github:LLGGJ/opencode-flatai
flatai --version
flatai --standalone
```

Se o Debian já estiver instalado, use apenas `proot-distro login debian`.
Confirme `node --version` (18 ou superior). Para abrir novamente pelo Termux:

```bash
proot-distro login debian -- flatai --standalone
```

**A execução em aparelho Android ainda não foi validada.** O Debian compartilha
o kernel do Android: `Bad system call` pode persistir por incompatibilidade do
runtime com o aparelho. Envie o erro completo e `uname -m` nesse caso.
A instalação nativa no Termux falha com uma orientação para usar Debian.

## Desenvolvimento e npm link

Para trabalhar em um checkout existente, use Bun 1.4.2:

```bash
bun run setup:dev
cd script/local-cli
npm link
flatai --standalone
```

`npm link` registra o comando; as dependências de desenvolvimento são instaladas
por Bun. A versão do lançador de desenvolvimento aparece como `local`.
Para trocar esse vínculo pela distribuição compilada:

```bash
npm uninstall -g opencode-flatai-local
npm install -g github:LLGGJ/opencode-flatai
```

### Gerar uma release

As ferramentas de desenvolvimento ficam em `packages/dev-tools`; o manifesto
raiz mantém o pacote npm sem dependências de workspaces. `package.bun.json`
guarda o manifesto de desenvolvimento; `bun run setup:dev` o aplica apenas
durante a instalação e restaura o manifesto npm ao terminar. Use o build existente:

```bash
OPENCODE_CHANNEL=flatai OPENCODE_VERSION=2.0.29 bun run packages/cli/script/build.ts --target=opencode-linux-x64-baseline --skip-install --skip-web-ui
```

Compile também `opencode-linux-arm64` com suas dependências nativas disponíveis.
Comprima os executáveis com gzip, publique-os na release `v<versão>` e atualize
`script/npm/releases.json` com os nomes e SHA-256 dos executáveis descompactados.
A versão de `package.json`, do pacote CLI e da release deve coincidir.

## 🏷️ Lançamentos & Versões

As releases e tags deste repositório são geradas automaticamente a cada commit ou upload de ZIP via DevFlow Hub, mantendo o histórico de deploys sincronizado com o GitHub Actions.

---

_Gerado automaticamente via **DevFlow Hub** em 12/10/2026._
