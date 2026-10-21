const fs = require('node:fs')
const path = require('node:path')
const root = path.resolve(__dirname, '../..')
const manifest = path.join(root, 'package.json')
const backup = path.join(root, '.package-before-pack.json')
if (process.env.npm_lifecycle_event === 'postpack') {
  if (fs.existsSync(backup)) fs.renameSync(backup, manifest)
} else {
  const source = fs.readFileSync(manifest, 'utf8')
  const pkg = JSON.parse(source)
  fs.writeFileSync(backup, source)
  for (const key of ['workspaces', 'overrides', 'patchedDependencies', 'trustedDependencies', 'packageManager']) delete pkg[key]
  pkg.scripts = { postinstall: pkg.scripts.postinstall }
  fs.writeFileSync(manifest, JSON.stringify(pkg, null, 2) + '\n')
}
