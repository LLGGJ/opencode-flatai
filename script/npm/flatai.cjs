#!/usr/bin/env node
const path = require("node:path")
const fs = require("node:fs")
const { spawnSync } = require("node:child_process")
if (!fs.existsSync(path.join(__dirname, "flatai-bin"))) {
  console.error("Downloading the FlatAI release (first launch only)...")
  const install = spawnSync(process.execPath, [path.join(__dirname, "install.cjs")], { stdio: "inherit" })
  if (install.error) {
    console.error(install.error.message)
    process.exit(1)
  }
  if (install.status !== 0) process.exit(install.status ?? 1)
}
const result = spawnSync(path.join(__dirname, "flatai-bin"), process.argv.slice(2), {
  stdio: "inherit",
  env: { ...process.env, OPENCODE_DISABLE_AUTOUPDATE: "1" },
})
if (result.error) {
  console.error(
    `Cannot start FlatAI: ${result.error.message}. Reinstall with npm install -g github:LLGGJ/opencode-flatai`,
  )
  process.exit(1)
}
if (result.signal) process.kill(process.pid, result.signal)
process.exit(result.status ?? 1)
