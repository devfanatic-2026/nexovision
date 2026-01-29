import fetch from 'node-fetch';
import { AnalysisResult, ScrapedArticle, EntityExtraction } from '../types';

export class DeepSeekEngine {
    private apiKey: string;
    private baseUrl = 'https://api.deepseek.com/v1'; // Standard DeepSeek endpoint

    constructor(apiKey?: string) {
        // Allow passing key at runtime if needed, but constructor key is primary
        this.apiKey = apiKey || '';
    }

    async analyze(article: ScrapedArticle, instruction: string = '', userKey?: string): Promise<EntityExtraction | null> {
        const key = userKey || this.apiKey;
        if (!key) {
            console.error('[DeepSeekEngine] No API Key provided');
            return null;
        }

        try {
            const systemPrompt = `You are an expert News Analyst for a high-end media platform. 
            Your goal is to extract structured entities (People, Organizations, Media Outlets) and provide a concise summary.
            
            IMPORTANT: Return ONLY valid JSON. No markdown formatting, no preambles.
            
            Format:
            {
                "people": ["Full Name 1", "Full Name 2"],
                "organizations": ["Org 1", "Org 2"],
                "media": ["Media Outlet 1", "Media Outlet 2"],
                "summary": "2-3 sentence summary of the news intent.",
                "sentiment": "positive" | "negative" | "neutral",
                "topics": ["Topic 1", "Topic 2"]
            }

            If an entity is not found, return empty array.
            `;

            const userPrompt = `
            ${instruction ? `INSTRUCTION: ${instruction}` : ''}

            ARTICLE TITLE: ${article.title}
            ARTICLE CONTENT: 
            ${article.textContent.slice(0, 15000)} // Truncate to avoid context limit overflow
            `;

            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`
                },
                body: JSON.stringify({
                    model: "deepseek-reasoner", // As requested by user "DeepSeek Reasoner"
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    stream: false
                })
            });

            if (!response.ok) {
                console.error(`[DeepSeek] Error ${response.status}: ${await response.text()}`);
                return null;
            }

            const data: any = await response.json();
            const content = data.choices[0]?.message?.content;

            // Clean markdown code blocks if present (common LLM artifact)
            const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();

            return JSON.parse(jsonStr);

        } catch (error) {
            console.error('[DeepSeekEngine] Analysis failed:', error);
            return null;
        }
    }
}
