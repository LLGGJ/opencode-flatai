import type { PluginInternal } from "./internal.js"

// FlatAI uses the built-in OpenAI-compatible transport. No SDK downloads or vendor discovery are needed.
export const ProviderPlugins: PluginInternal.InternalPlugin[] = []
