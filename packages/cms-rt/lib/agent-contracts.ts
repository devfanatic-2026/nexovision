export interface AgentContract {
    name: string;
    markdownContent: string;
    preferredModel?: string;
    // getPrompt logic is now handled server-side via /api/agents/prompt
}

// NOTE: Hardcoded contracts have been removed in favor of strict filesystem-based Markdown contracts.
// See cms/contracts/*.md and cms/app/api/agents/prompt/route.ts
