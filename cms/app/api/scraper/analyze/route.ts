import { NewsScraper } from '@float.js/scraper';
import { LLMClient, type LLMProvider } from '../../../../lib/llm';

export async function POST(req: Request) {
    try {
        const { url, instruction, apiKey, provider = 'gemini' } = await req.json();

        if (!url) {
            return new Response(JSON.stringify({ error: 'URL is required' }), { status: 400 });
        }

        // Initialize scraper. For analysis we don't *strictly* need a key if we do it manually via LLMClient,
        // but if scraping needs it (some sites needed proxies/scraping-api), we pass it.
        const scraperKey = provider === 'deepseek' ? apiKey : process.env.DEEPSEEK_API_KEY;
        const scraper = new NewsScraper(scraperKey);

        // Step 1: Smart Scrape
        const scrapeResult = await scraper.scrape(url, {
            strategy: 'smart',
            instruction
        });

        if (!scrapeResult) {
            return new Response(JSON.stringify({ error: 'Failed to scrape content' }), { status: 500 });
        }

        let analysis = null;
        const client = new LLMClient(provider as LLMProvider, apiKey);

        // Step 2: Analysis using LLMClient (replaces scraper.analyze)
        try {
            console.log(`[API] analyzing with ${provider} for ${url}`);
            const analysisPrompt = `
             Analyze this news article:
             Title: ${scrapeResult.article.title}
             Content: ${scrapeResult.article.textContent}
             
             Instruction: ${instruction || 'Provide a summary and extracted entities.'}
             
             Output JSON with:
             - summary (string)
             - people (array of strings)
             - organizations (array of strings)
             - media (array of strings)
             `;

            const analysisRes = await client.chat({
                system: 'You are a News Analyst. Output JSON.',
                messages: [{ role: 'user', content: analysisPrompt }],
                response_format: 'json_object'
            });

            analysis = JSON.parse(analysisRes.content.replace(/```json/g, '').replace(/```/g, ''));
        } catch (e) {
            console.error('Analysis failed', e);
        }

        await scraper.cleanup();

        return new Response(JSON.stringify({
            article: scrapeResult.article,
            analysis
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('[API] Scraper Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
