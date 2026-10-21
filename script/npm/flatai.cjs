#!/usr/bin/env node
const path = require("node:path")
const { spawnSync } = require("node:child_process")
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
