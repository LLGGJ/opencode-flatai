import { define } from "@opencode/plugin/effect/plugin"
import { Effect } from "effect"

// Runs after configuration and external plugins so old settings cannot restore other AI providers.
export const FlatAIPlugin = define({
  id: "flatai.providers",
  effect: Effect.fn(function* (ctx) {
    yield* ctx.integration.transform((integrations) => {
      for (const integration of integrations.list()) {
        if (integration.id !== "flatai") integrations.remove(integration.id)
      }
    })
    yield* ctx.provider.transform((providers) => {
      for (const definition of providers.list()) {
        if (definition.provider.id !== "flatai") providers.remove(definition.provider.id)
      }
    })
  }),
})
