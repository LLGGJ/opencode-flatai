#!/usr/bin/env node

const childProcess = require("node:child_process")
const fs = require("node:fs")
const path = require("node:path")

if (process.platform === "android") {
  console.error("Use Debian via proot-distro no Termux. Consulte a seção Android/Termux do README.md.")
  process.exit(1)
}

// npm links this file through a symlink; resolve the checkout without changing the user's project directory.
const root = path.resolve(path.dirname(fs.realpathSync(__filename)), "../..")
const cli = path.join(root, "packages/cli")
try {
  require.resolve("@opentui/solid/preload", { paths: [cli] })
} catch {
  console.error(`Dependências ausentes. Execute bun install --frozen-lockfile em ${root}`)
  process.exit(1)
}

const result = childProcess.spawnSync("bun", [path.join(root, "script/local-cli/main.ts"), ...process.argv.slice(2)], {
  stdio: "inherit",
})
if (result.error) {
  console.error(
    result.error.code === "ENOENT" ? "Bun não encontrado. Instale o Bun 1.4.2 e confira o PATH." : result.error.message,
  )
  process.exit(1)
}
if (result.signal) process.kill(process.pid, result.signal)
process.exit(result.status ?? 1)
