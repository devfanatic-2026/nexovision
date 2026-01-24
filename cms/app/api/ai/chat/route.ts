
import { LLMClient, type LLMProvider } from '../../../../lib/llm';

export async function POST(req: Request) {
    try {
        const { messages, provider = 'gemini', system } = await req.json();

        const client = new LLMClient(provider as LLMProvider);

        const res = await client.chat({
            messages,
            system,
            response_format: 'text'
        });

        // Simply return text for now. (Streaming not implemented in LLMClient yet, but RichTextEditor expects full content in loop or stream)
        // RichTextEditor uses ai.streamChat.
        // If we switch to fetch, we need to mimic stream or return full.
        // For simplicity, we return full json and frontend will handle it?
        // Wait, frontend expects stream.
        // I should implement simple streaming in LLMClient or fake it here.
        // Or just return JSON and update frontend to handle non-stream.

        return new Response(JSON.stringify({ content: res.content }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Chat API Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
