import { expect, test } from "bun:test"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"

const installer = path.join(import.meta.dir, "../../../script/install-termux.sh")
const installTest = process.platform === "win32" ? test.skip : test

installTest("Termux installer clones and links inside Debian", async () => {
  const result = await run("new")
  expect(result.status).toBe(0)
  expect(result.stdout).toContain("proot-distro login debian -- flatai --standalone")
  expect(result.calls.some((call) => call.command === "git" && call.args[0] === "clone")).toBe(true)
  expect(result.calls.find((call) => call.command === "npm" && call.args[0] === "link")?.cwd).toBe(
    path.join(result.guest, "opencode-flatai/script/local-cli"),
  )
  expect(
    result.calls.some((call) => call.command === "bun" && call.args.join(" ") === "install --frozen-lockfile"),
  ).toBe(true)
})

installTest("Termux installer updates an existing Debian clone without cloning again", async () => {
  const result = await run("existing")
  expect(result.status).toBe(0)
  expect(result.calls.filter((call) => call.command === "git").map((call) => call.args)).toEqual([
    ["-C", path.join(result.guest, "opencode-flatai"), "pull", "--ff-only", "origin", "main"],
  ])
})

for (const scenario of ["bun-install-fails", "bun-version-fails", "old-checkout", "apt-fails"]) {
  installTest(`Termux installer stops before npm link when ${scenario}`, async () => {
    const result = await run(scenario)
    expect(result.status).not.toBe(0)
    expect(result.stdout).not.toContain("Instalação concluída")
    expect(result.calls.some((call) => call.command === "npm" && call.args[0] === "link")).toBe(false)
    if (scenario.startsWith("bun-")) expect(result.stderr).toContain("Bad system call")
    if (scenario === "bun-install-fails") expect(result.status).toBe(159)
  })
}

installTest("installer rejects Linux outside Termux before running setup commands", async () => {
  const result = await run("not-termux")
  expect(result.status).toBe(1)
  expect(result.stderr).toContain("Execute este instalador no Termux")
  expect(result.calls).toEqual([])
})

type Call = { command: string; args: string[]; cwd: string }

async function run(scenario: string) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "flatai-termux-install-"))
  const bin = path.join(root, "bin")
  const guest = path.join(root, "guest")
  const calls = path.join(root, "calls.jsonl")
  await fs.mkdir(bin)
  await fs.mkdir(guest)
  if (scenario === "existing" || scenario === "old-checkout") {
    await fs.mkdir(path.join(guest, "opencode-flatai/.git"), { recursive: true })
    await fs.writeFile(
      path.join(guest, "opencode-flatai/package.json"),
      JSON.stringify({ packageManager: "bun@1.4.2" }),
    )
    if (scenario === "existing") {
      await fs.mkdir(path.join(guest, "opencode-flatai/script/local-cli"), { recursive: true })
      await fs.writeFile(path.join(guest, "opencode-flatai/script/local-cli/package.json"), "{}")
    }
  }
  try {
    for (const command of ["uname", "proot-distro", "apt-get", "git", "npm", "bun", "flatai"]) {
      await fs.writeFile(
        path.join(bin, command),
        `#!${process.execPath}
const fs = require("node:fs")
const path = require("node:path")
const command = ${JSON.stringify(command)}
const args = process.argv.slice(2)
const scenario = process.env.FLATAI_TEST_CASE
fs.appendFileSync(process.env.FLATAI_TEST_CALLS, JSON.stringify({ command, args, cwd: process.cwd() }) + "\\n")
if (command === "uname") console.log("aarch64")
if (command === "proot-distro" && args[0] === "login" && args.at(-1) === "true") process.exit(1)
if (command === "proot-distro" && args.at(-1) === "-s") {
  const result = Bun.spawnSync(["bash", "-s"], {
    stdin: fs.readFileSync(0), stdout: "inherit", stderr: "inherit",
    env: { ...process.env, HOME: process.env.FLATAI_TEST_GUEST },
  })
  process.exit(result.exitCode)
}
if (command === "git" && args[0] === "clone") {
  const checkout = args.at(-1)
  fs.mkdirSync(path.join(checkout, "script/local-cli"), { recursive: true })
  fs.writeFileSync(path.join(checkout, "package.json"), JSON.stringify({ packageManager: "bun@1.4.2" }))
  fs.writeFileSync(path.join(checkout, "script/local-cli/package.json"), "{}")
}
if (command === "apt-get" && scenario === "apt-fails") process.exit(70)
if (command === "bun" && scenario === "bun-install-fails" && args[0] === "install") process.exit(159)
if (command === "bun" && scenario === "bun-version-fails") process.exit(159)
`,
        { mode: 0o755 },
      )
    }
    const child = Bun.spawn(["bash", installer], {
      env: {
        ...process.env,
        PATH: bin + path.delimiter + process.env.PATH,
        TERMUX_VERSION: scenario === "not-termux" ? undefined : "test",
        PREFIX: path.join(root, "data/data/com.termux/files/usr"),
        FLATAI_TEST_CASE: scenario,
        FLATAI_TEST_CALLS: calls,
        FLATAI_TEST_GUEST: guest,
      },
      stdout: "pipe",
      stderr: "pipe",
    })
    const [stdout, stderr, status] = await Promise.all([
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
      child.exited,
    ])
    const entries = await fs.readFile(calls, "utf8").catch(() => "")
    return {
      stdout,
      stderr,
      status,
      guest,
      calls: entries
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((line): Call => JSON.parse(line)),
    }
  } finally {
    await fs.rm(root, { recursive: true, force: true })
  }
}
