#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${TERMUX_VERSION:-}" || "${PREFIX:-}" != */com.termux/* ]]; then
    echo "Execute este instalador no Termux. Para Linux/macOS, siga o README.md." >&2
    exit 1
fi

case "$(uname -m)" in
    aarch64|x86_64) ;;
    *)
        echo "Arquitetura não suportada. Esta instalação requer Android de 64 bits (aarch64 ou x86_64)." >&2
        exit 1
        ;;
esac

if ! command -v proot-distro >/dev/null 2>&1; then
    pkg install -y proot-distro
fi
if ! proot-distro login debian -- true >/dev/null 2>&1; then
    proot-distro install debian
fi

# Use a separate Linux checkout: partial Android node_modules cannot be reused inside Debian.
proot-distro login debian -- bash -s <<'DEBIAN'
set -euo pipefail
apt-get update
apt-get install -y git ca-certificates unzip nodejs npm build-essential python3

checkout="$HOME/opencode-flatai"
if [[ -d "$checkout/.git" ]]; then
    git -C "$checkout" pull --ff-only origin main
elif [[ -e "$checkout" ]]; then
    echo "A pasta $checkout já existe e não é um clone Git. Mova-a e execute o instalador novamente." >&2
    exit 1
else
    git clone --branch main --single-branch https://github.com/LLGGJ/opencode-flatai.git "$checkout"
fi
cd "$checkout"
if [[ ! -f script/local-cli/package.json ]]; then
    echo "Clone desatualizado: script/local-cli não existe. Confira git status e atualize a main." >&2
    exit 1
fi

bun_version="$(node -p 'require("./package.json").packageManager.replace(/^bun@/, "")')"
npm install -g "bun@$bun_version"
if ! bun --version; then
    echo "O Bun não iniciou dentro do Debian. Se apareceu Bad system call, este Android ainda bloqueia uma chamada de sistema do runtime; envie este erro completo." >&2
    exit 1
fi
if bun install --frozen-lockfile; then
    cd script/local-cli
else
    status=$?
    echo "A instalação das dependências falhou (código $status). O npm link não foi executado. Se apareceu Bad system call, envie este erro completo." >&2
    exit "$status"
fi
npm link
flatai --version
DEBIAN

cat <<'DONE'
Instalação concluída dentro do Debian.
Para abrir a CLI a partir do Termux, execute:
  proot-distro login debian -- flatai --standalone
DONE
