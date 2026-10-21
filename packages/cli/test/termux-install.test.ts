import { expect, test } from "bun:test"
import path from "node:path"

const installer = path.join(import.meta.dir, "../../../script/install-termux.sh")
const hostTest = process.platform === "linux" && !process.env.TERMUX_VERSION ? test : test.skip

hostTest("Termux installer rejects a Linux host outside Termux", () => {
  const result = Bun.spawnSync(["bash", installer], { stdout: "pipe", stderr: "pipe" })
  expect(result.exitCode).toBe(1)
  expect(result.stderr.toString()).toContain("Execute este instalador no Termux")
  expect(result.stdout.toString()).not.toContain("Instalação concluída")
})
