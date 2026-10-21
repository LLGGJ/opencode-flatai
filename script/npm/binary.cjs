const path = require("node:path")
const os = require("node:os")
const manifest = require("./releases.json")
module.exports = path.join(
  process.env.XDG_CACHE_HOME || path.join(os.homedir(), ".cache"),
  "flatai",
  manifest.version,
  `${process.platform}-${process.arch}`,
  "flatai",
)
