import { NewsScraper } from '@float.js/scraper';
import { LLMClient, type LLMProvider } from '../../../../lib/llm';

export async function POST(req: Request) {
    try {
        const { category, instruction, apiKey, provider = 'gemini' } = await req.json();

        const client = new LLMClient(provider as LLMProvider, apiKey);

        // For scraper, we still might need an API key if it uses one internally for scraping (not analysis).
        // If scraper uses key for analysis only, we can skip passing it if we do analysis manually here.
        // But NewsScraper constructor takes a key. Let's pass the one we have or process.env.
        // If using Gemini, scraper (if it relies on DeepSeek) might fail if we pass a Gemini key.
        // We should verify what Scraper does with the key.
        // For now, let's assume we pass the key if provider is deepseek, or undefined if gemini?
        // Actually, let's pass it if available.
        const scraperKey = provider === 'deepseek' ? apiKey : process.env.DEEPSEEK_API_KEY;
        const scraper = new NewsScraper(scraperKey);

        // 1. DISCOVERY PHASE
        const discoveryPrompt = `
        Act as a News Editor for "Nexovisión", a regional news outlet in Coquimbo, Chile.
        I need to find the best current news sources for the category: "${category}".
        The instruction is: "${instruction || 'Find the most important news right now'}".
        
        Return a JSON object with a "hubs" array containing 3 URLs of news hubs (lists of articles) to scan.
        Prioritize Chilean sources (Emol, La Tercera, BioBio, Cooperativa) or relevant niche sites.
        Example: { "hubs": ["https://www.emol.com/nacional", "https://www.latercera.com/canal/politica/"] }
        `;

        const discoveryRes = await client.chat({
            system: 'You are a news discovery engine. Output JSON only.',
            messages: [{ role: 'user', content: discoveryPrompt }],
            response_format: 'json_object'
        });

        let hubs: string[] = [];
        try {
            const jsonStr = discoveryRes.content.replace(/```json/g, '').replace(/```/g, '');
            hubs = JSON.parse(jsonStr).hubs;
        } catch (e) {
            console.error('Failed to parse discovery JSON', e);
            hubs = ['https://www.emol.com', 'https://www.latercera.com'];
        }

        // 2. SCANNING PHASE
        let allHeadlines: any[] = [];
        const scanPromises = hubs.map(url => scraper.scan(url));
        const scanResults = await Promise.all(scanPromises);

        scanResults.forEach((res: any) => {
            if (res && res.headlines) {
                allHeadlines.push(...res.headlines);
            }
        });

        if (allHeadlines.length === 0) {
            return new Response(JSON.stringify({ error: 'No headlines found to analyze.' }), { status: 404 });
        }

        // 3. SELECTION PHASE
        const headlinesList = allHeadlines.map((h, i) => `${i}. [${h.source}] ${h.title} (${h.url})`).join('\n');

        const selectionPrompt = `
        I have scanned the following headlines:
        ${headlinesList}

        Task: Select the SINGLE best article to rewrite for our audience.
        Criteria:
        1. Matches instruction: "${instruction}"
        2. High impact / Relevance.
        3. Freshness (implied).

        Output JSON: { "selectedIndex": number, "reason": "why you picked it" }
        `;

        const selectionRes = await client.chat({
            system: 'You are a Chief Editor. Pick the best story. Output JSON.',
            messages: [{ role: 'user', content: selectionPrompt }],
            response_format: 'json_object'
        });

        let selectedUrl = '';
        try {
            const jsonStr = selectionRes.content.replace(/```json/g, '').replace(/```/g, '');
            const selection = JSON.parse(jsonStr);
            const index = selection.selectedIndex;
            if (allHeadlines[index]) {
                selectedUrl = allHeadlines[index].url;
            }
        } catch (e) {
            selectedUrl = allHeadlines[0].url;
        }

        // 4. EXTRACTION PHASE
        const article = await scraper.scrape(selectedUrl, { instruction });

        // 5. AUTO-ANALYSIS
        let analysis = null;
        if (article) {
            // Manual analysis using our client to support Gemini
            const analysisPrompt = `
             Analyze this news article:
             Title: ${article.article.title}
             Content: ${article.article.textContent}
             
             Instruction: ${instruction || 'Provide a summary and extracted entities.'}
             
             Output JSON with:
             - summary (string)
             - people (array of strings)
             - organizations (array of strings)
             - media (array of strings)
             `;

            try {
                const analysisRes = await client.chat({
                    system: 'You are a News Analyst. Output JSON.',
                    messages: [{ role: 'user', content: analysisPrompt }],
                    response_format: 'json_object'
                });
                analysis = JSON.parse(analysisRes.content.replace(/```json/g, '').replace(/```/g, ''));
            } catch (e) {
                console.error("Analysis failed", e);
            }
        }

        return new Response(JSON.stringify({
            article: article?.article,
            analysis: analysis,
            journey: {
                hubs_scanned: hubs,
                headlines_found: allHeadlines.length,
                selected_url: selectedUrl
            }
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Hunt Agent Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
