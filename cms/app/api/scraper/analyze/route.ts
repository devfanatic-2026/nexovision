
import { NewsScraper } from '@float.js/scraper';

export async function POST(req: Request) {
    try {
        const { url, instruction, deepseek_key } = await req.json();

        if (!url) {
            return new Response(JSON.stringify({ error: 'URL is required' }), { status: 400 });
        }

        // Initialize scraper with key (priority to request key -> env key)
        const apiKey = deepseek_key || process.env.DEEPSEEK_API_KEY;

        const scraper = new NewsScraper(apiKey);

        // Step 1: Smart Scrape
        const scrapeResult = await scraper.scrape(url, {
            strategy: 'smart',
            instruction
        });

        if (!scrapeResult) {
            return new Response(JSON.stringify({ error: 'Failed to scrape content' }), { status: 500 });
        }

        let analysis = null;

        // Step 2: DeepSeek Analysis (if key provided)
        if (apiKey) {
            console.log(`[API] analyzing with DeepSeek for ${url}`);
            analysis = await scraper.analyze(scrapeResult.article, instruction || '', apiKey);
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
