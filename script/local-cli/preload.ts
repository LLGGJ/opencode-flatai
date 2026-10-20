import { fileURLToPath } from "node:url"

// Resolve with Bun's export conditions; Node resolves this package to an error stub.
await import(Bun.resolveSync("@opentui/solid/preload", fileURLToPath(new URL("../../packages/cli/", import.meta.url))))
