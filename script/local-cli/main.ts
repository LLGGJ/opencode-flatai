import { fileURLToPath } from "node:url"

// Keep setup in the entrypoint so server subprocesses repeat it without relying on inherited Bun flags.
await import(Bun.resolveSync("@opentui/solid/preload", fileURLToPath(new URL("../../packages/cli/", import.meta.url))))

await import("../../packages/cli/src/index.ts")
