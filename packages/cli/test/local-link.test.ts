import { expect, test } from "bun:test"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { isolatedEnv } from "./fixture/environment"

const localTest = process.platform === "win32" ? test.skip : test

localTest(
  "npm-linked flatai starts its standalone server from outside the checkout",
  async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "flatai-local-link-"))
    const directory = path.join(root, "project with spaces")
    const prefix = path.join(root, "prefix")
    const env = isolatedEnv(root, {
      npm_config_prefix: prefix,
      npm_config_cache: path.join(root, "npm-cache"),
    })
    await fs.mkdir(directory)
    try {
      const link = Bun.spawn(["npm", "link", "--no-audit", "--no-fund"], {
        cwd: path.join(import.meta.dir, "../../../script/local-cli"),
        env,
        stdout: "pipe",
        stderr: "pipe",
      })
      const [linkError, linkStatus] = await Promise.all([new Response(link.stderr).text(), link.exited])
      expect({ status: linkStatus, stderr: linkError }).toEqual({ status: 0, stderr: "" })
      const child = Bun.spawn([path.join(prefix, "bin/flatai"), "api", "--standalone", "GET", "/api/info"], {
        cwd: directory,
        env,
        stdout: "pipe",
        stderr: "pipe",
      })
      const [stdout, stderr, status] = await Promise.all([
        new Response(child.stdout).text(),
        new Response(child.stderr).text(),
        child.exited,
      ])
      expect({ status, stderr }).toEqual({ status: 0, stderr: "" })
      expect(JSON.parse(stdout)).toMatchObject({ version: "local" })
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  },
  60_000,
)
