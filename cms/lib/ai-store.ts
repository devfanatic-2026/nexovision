import { createFloatStore } from '@float.js/core';

interface AIState {
    provider: 'openai' | 'anthropic' | 'deepseek' | 'gemini';
    apiKey: string;
}

/**
 * AI Configuration Store
 * Persists the API key and provider choice in the browser's localStorage
 */
export const useAIStore = createFloatStore<AIState>(
    {
        provider: 'gemini',
        apiKey: '',
    },
    {
        persist: 'ai-config',
    }
);
