# FlatAI

Chat de programação com IA no terminal, baseado no OpenCode. O único comando
para iniciar é `flatai`; a escolha de modelos e a configuração de MCP ficam
dentro do chat. Esta distribuição usa apenas o provedor FlatAI.

## Instalar e abrir

Requisitos: Linux com glibc (Debian/Ubuntu), x64 ou arm64, Node.js 18+, npm e Git.
Não é necessário clonar o repositório, instalar Bun ou compilar dependências.

```bash
npm install -g github:LLGGJ/opencode-flatai
flatai
```

O pacote npm não tem dependências de execução. Na primeira abertura, baixa o
executável da release e verifica seu SHA-256. As próximas aberturas reutilizam
o cache em `$XDG_CACHE_HOME/flatai` ou `~/.cache/flatai`. O download inicial
precisa de acesso ao GitHub Releases e seu tempo depende da conexão.

### Dentro do chat

- `/connect`: configurar a chave de API da FlatAI. Também aceita `FLATAI_API_KEY` no ambiente.
- `/models`: escolher um dos modelos disponíveis na FlatAI.
- `/mcp`: gerenciar as conexões MCP configuradas; `/mcps` continua como alias.
- `/help`: consultar os atalhos do chat.

Os antigos subcomandos de terminal foram removidos. `flatai --help` mostra a
ajuda de inicialização e `flatai --version` mostra a versão instalada.

Para atualizar ou remover:

```bash
npm install -g github:LLGGJ/opencode-flatai
npm uninstall -g flatai
```

Se o npm 12 responder `EALLOWGIT`, execute `npm config set allow-git all`
e repita a instalação.

## Android/Termux

O executável usa glibc e não roda diretamente no Android/Bionic. Use Debian
via proot, sem clonar o projeto nem instalar suas dependências de desenvolvimento:

```bash
pkg update
pkg install proot-distro
proot-distro install debian
proot-distro login debian
apt-get update
apt-get install -y nodejs npm git ca-certificates
npm install -g github:LLGGJ/opencode-flatai
flatai
```

Se o Debian já existe, entre com `proot-distro login debian`.
Confirme que `node --version` é 18 ou superior. Para abrir novamente pelo Termux:

```bash
proot-distro login debian -- flatai
```

**A execução em aparelho Android ainda não foi validada.** Debian via proot
compartilha o kernel do Android; erros como `Bad system call` podem persistir
conforme o aparelho. Nesse caso, informe o erro completo e `uname -m`.
macOS, Windows e Alpine/musl ainda não têm binários nesta distribuição.

## Desenvolvimento e npm link

Somente para desenvolvimento em um checkout existente, com Bun 1.4.2:

```bash
bun run setup:dev
cd script/local-cli
npm link
flatai
```

`npm link` registra o comando; Bun instala as dependências de desenvolvimento.
O lançador de desenvolvimento mostra a versão `local`. Para voltar ao pacote compilado:

```bash
npm uninstall -g opencode-flatai-local
npm install -g github:LLGGJ/opencode-flatai
```

### Gerar uma release

O manifesto npm raiz não contém dependências de workspaces. `package.bun.json`
guarda o manifesto de desenvolvimento; `bun run setup:dev` o aplica durante a
instalação e restaura o manifesto npm ao terminar.

```bash
OPENCODE_CHANNEL=flatai OPENCODE_VERSION=2.1.1 bun run packages/cli/script/build.ts --target=opencode-linux-x64-baseline --skip-install --skip-web-ui
```

Compile também `opencode-linux-arm64` com as dependências nativas disponíveis.
Comprima os executáveis com gzip, publique-os na release `v<versão>` e atualize
`script/npm/releases.json` com os nomes e SHA-256 dos executáveis descompactados.
As versões dos manifestos e da release devem coincidir. O arquivo `.gitattributes`
limita os arquivos exportados para instalação; o checkout Git mantém os arquivos
de desenvolvimento. Esta distribuição inclui o chat de terminal, sem interface web.

## Licença

[MIT](LICENSE)
