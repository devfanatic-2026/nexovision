import { createFloatStore } from '@float.js/core';

interface AIState {
    provider: 'openai' | 'anthropic' | 'deepseek';
    apiKey: string;
}

/**
 * AI Configuration Store
 * Persists the API key and provider choice in the browser's localStorage
 */
export const useAIStore = createFloatStore<AIState>(
    {
        provider: 'deepseek',
        apiKey: '',
    },
    {
        persist: 'ai-config',
    }
);
