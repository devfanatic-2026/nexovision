
export type LLMProvider = 'deepseek' | 'gemini';

export interface LLMRequest {
    system?: string;
    messages: { role: 'user' | 'system' | 'assistant'; content: string }[];
    response_format?: 'json_object' | 'text';
    temperature?: number;
}

export interface LLMResponse {
    content: string;
}

export class LLMClient {
    private provider: LLMProvider;
    private apiKey?: string;

    constructor(provider: LLMProvider = 'gemini', apiKey?: string) {
        this.provider = provider;
        this.apiKey = apiKey;
    }

    private getEffectiveKey() {
        if (this.apiKey) return this.apiKey;
        if (this.provider === 'deepseek') return process.env.DEEPSEEK_API_KEY;
        if (this.provider === 'gemini') return process.env.GOOGLE_API_KEY; // User set this var
        return '';
    }

    async chat(request: LLMRequest): Promise<LLMResponse> {
        const key = this.getEffectiveKey();
        if (!key) throw new Error(`Missing API Key for provider: ${this.provider}`);

        if (this.provider === 'deepseek') {
            return this.callDeepSeek(request, key);
        } else if (this.provider === 'gemini') {
            return this.callGemini(request, key);
        }

        throw new Error(`Unsupported provider: ${this.provider}`);
    }

    private async callDeepSeek(req: LLMRequest, key: string): Promise<LLMResponse> {
        // Prepare messages (prepend system if needed)
        const messages = [...req.messages];
        if (req.system) {
            messages.unshift({ role: 'system', content: req.system });
        }

        const model = req.response_format === 'json_object' ? 'deepseek-chat' : 'deepseek-chat';
        // Note: 'deepseek-reasoner' is used in specific cases in the original code, 
        // but 'deepseek-chat' is the standard V3.

        const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                temperature: req.temperature ?? 0.7,
                response_format: req.response_format ? { type: req.response_format } : undefined
            })
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`DeepSeek API Error (${res.status}): ${errText}`);
        }

        const data = await res.json();
        return {
            content: data.choices[0].message.content
        };
    }

    private async callGemini(req: LLMRequest, key: string): Promise<LLMResponse> {
        // Construct prompt from messages
        // Gemini REST API expects "contents" array.
        // System instructions can be passed via system_instruction (v1beta) or just prepended.

        let contents = req.messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model', // Gemini uses 'model' for assistant
            parts: [{ text: m.content }]
        }));

        // Filter out system messages from 'contents' as they belong in system_instruction or need merge
        const systemMsgs = contents.filter(c => c.role === 'system'); // Wait, I mapped 'system'->'model'? 
        // Actually, mapped role logic above is simplistic.

        // Correct mapping:
        // user -> user
        // assistant -> model
        // system -> system_instruction

        const geminiContents = req.messages
            .filter(m => m.role !== 'system')
            .map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            }));

        const systemContent = req.system || req.messages.find(m => m.role === 'system')?.content;

        const model = 'gemini-1.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

        const body: any = {
            contents: geminiContents,
            generationConfig: {
                temperature: req.temperature ?? 0.7,
            }
        };

        if (systemContent) {
            body.systemInstruction = {
                parts: [{ text: systemContent }]
            };
        }

        if (req.response_format === 'json_object') {
            body.generationConfig.responseMimeType = "application/json";
        }

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Gemini API Error (${res.status}): ${errText}`);
        }

        const data = await res.json();

        // Safety check
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('Gemini returned no candidates');
        }

        const text = data.candidates[0].content.parts[0].text;
        return { content: text };
    }
}
