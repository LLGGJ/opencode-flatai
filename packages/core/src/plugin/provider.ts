import { DynamicProviderPlugin } from "./provider/dynamic.js"
import { PromptCacheKeyPlugin } from "./provider/prompt-cache-key.js"
import type { PluginInternal } from "./internal.js"

// This build exposes only FlatAI (see models-dev/snapshot.txt). The vendor-specific plugins under
// ./provider/ are intentionally not registered: each one either adds a provider of its own (OpenCode Zen,
// ChatGPT, local Ollama/LM Studio/vLLM discovery) or adds login methods for a catalog provider that no longer exists.
// Register one here again to bring that provider back. FlatAI itself needs no plugin: it is an
// openai-compatible catalog entry, so the models-dev plugin provides its key and FLATAI_API_KEY methods.
export const ProviderPlugins: PluginInternal.InternalPlugin[] = [PromptCacheKeyPlugin, DynamicProviderPlugin]
