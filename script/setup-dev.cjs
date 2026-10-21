const fs = require("node:fs")
const path = require("node:path")
const { spawnSync } = require("node:child_process")
const root = path.resolve(__dirname, "..")
const manifest = path.join(root, "package.json")
const original = fs.readFileSync(manifest)
try {
  fs.copyFileSync(path.join(root, "package.bun.json"), manifest)
  const result = spawnSync("bun", ["install", "--frozen-lockfile", "--ignore-scripts"], { cwd: root, stdio: "inherit" })
  if (result.error) throw result.error
  if (result.status !== 0) process.exitCode = result.status ?? 1
} finally {
  fs.writeFileSync(manifest, original)
}
if (!process.exitCode) {
  for (const args of [
    ["run", "--cwd", "packages/core", "fix-node-pty"],
    ["run", "husky"],
  ]) {
    const result = spawnSync("bun", args, { cwd: root, stdio: "inherit" })
    if (result.error) throw result.error
    if (result.status !== 0) {
      process.exitCode = result.status ?? 1
      break
    }
  }
}
