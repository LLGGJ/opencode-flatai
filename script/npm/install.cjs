#!/usr/bin/env node
const fs = require("node:fs")
const path = require("node:path")
const crypto = require("node:crypto")
const zlib = require("node:zlib")
const { pipeline } = require("node:stream/promises")
const { Readable } = require("node:stream")

async function install() {
  // Bun installs the development workspaces; npm installs only the release binary.
  if (process.env.npm_config_user_agent?.startsWith("bun/")) return
  if (process.platform === "android" || process.env.PREFIX?.includes("com.termux")) {
    throw new Error(
      "Native Termux is unsupported. Install inside Debian (proot-distro login debian), then run npm install -g github:LLGGJ/opencode-flatai there. Android kernel compatibility still depends on the device.",
    )
  }
  const manifest = require("./releases.json")
  const target = `${process.platform}-${process.arch}`
  const asset = manifest.assets[target]
  if (!asset) throw new Error(`No FlatAI binary for ${target}. Supported: ${Object.keys(manifest.assets).join(", ")}`)
  if (process.platform === "linux" && !process.report.getReport().header.glibcVersionRuntime) {
    throw new Error("This release requires glibc Linux (for example Debian or Ubuntu).")
  }
  const destination = path.join(__dirname, "flatai-bin")
  const temporary = `${destination}.tmp`
  try {
    const response = await fetch(
      `https://github.com/LLGGJ/opencode-flatai/releases/download/v${manifest.version}/${asset.file}`,
      { signal: AbortSignal.timeout(300000) },
    )
    if (!response.ok) throw new Error(`Release download failed: HTTP ${response.status}`)
    const hash = crypto.createHash("sha256")
    const unzip = zlib.createGunzip()
    unzip.on("data", (chunk) => hash.update(chunk))
    await pipeline(Readable.fromWeb(response.body), unzip, fs.createWriteStream(temporary, { mode: 0o755 }))
    if (hash.digest("hex") !== asset.sha256) throw new Error("Release checksum mismatch")
    fs.chmodSync(temporary, 0o755)
    fs.renameSync(temporary, destination)
  } finally {
    fs.rmSync(temporary, { force: true })
  }
}
install().catch((error) => {
  console.error(`FlatAI installation failed: ${error.message}`)
  process.exitCode = 1
})
