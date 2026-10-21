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

# Install the compiled distribution inside Debian; no development checkout or Bun is needed.
proot-distro login debian -- bash -s <<'DEBIAN'
set -euo pipefail
apt-get update
apt-get install -y git ca-certificates nodejs npm
node -e 'if (Number(process.versions.node.split(".")[0]) < 18) throw new Error("FlatAI requer Node.js 18 ou superior")'
npm install -g github:LLGGJ/opencode-flatai
flatai --version
DEBIAN

cat <<'DONE'
Instalação concluída dentro do Debian.
Para abrir a CLI a partir do Termux, execute:
  proot-distro login debian -- flatai
DONE
