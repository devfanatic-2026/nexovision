
import { NewsScraper } from '@float.js/scraper';

// Helper to ask DeepSeek for JSON decisions
async function askDeepSeek(messages: any[], apiKey: string) {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'deepseek-reasoner', // or deepseek-chat if reasoner is too slow/expensive, but we want smarts
            messages: messages,
            temperature: 0.7,
            response_format: { type: 'json_object' }
        })
    });
    if (!response.ok) throw new Error(`DeepSeek API Error: ${await response.text()}`);
    return response.json();
}

export async function POST(req: Request) {
    try {
        const { category, instruction, deepseek_key } = await req.json();

        if (!deepseek_key) {
            return new Response(JSON.stringify({ error: 'DeepSeek API Key required for Hunt Mode' }), { status: 401 });
        }

        const scraper = new NewsScraper(deepseek_key);

        // 1. DISCOVERY PHASE
        const discoveryPrompt = `
        Act as a News Editor for "Nexovisión", a regional news outlet in Coquimbo, Chile.
        I need to find the best current news sources for the category: "${category}".
        The instruction is: "${instruction || 'Find the most important news right now'}".
        
        Return a JSON object with a "hubs" array containing 3 URLs of news hubs (lists of articles) to scan.
        Prioritize Chilean sources (Emol, La Tercera, BioBio, Cooperativa) or relevant niche sites.
        Example: { "hubs": ["https://www.emol.com/nacional", "https://www.latercera.com/canal/politica/"] }
        `;

        const discoveryData = await askDeepSeek([
            { role: 'system', content: 'You are a news discovery engine. Output JSON only.' },
            { role: 'user', content: discoveryPrompt }
        ], deepseek_key);

        let hubs: string[] = [];
        try {
            // DeepSeek might return the JSON in 'content' or nested.
            const jsonStr = discoveryData.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '');
            hubs = JSON.parse(jsonStr).hubs;
        } catch (e) {
            console.error('Failed to parse discovery JSON', e);
            // Fallback hubs if AI fails
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

        const selectionData = await askDeepSeek([
            { role: 'system', content: 'You are a Chief Editor. Pick the best story. Output JSON.' },
            { role: 'user', content: selectionPrompt }
        ], deepseek_key);

        let selectedUrl = '';
        try {
            const jsonStr = selectionData.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '');
            const selection = JSON.parse(jsonStr);
            const index = selection.selectedIndex;
            if (allHeadlines[index]) {
                selectedUrl = allHeadlines[index].url;
            }
        } catch (e) {
            // Fallback: pick random or first
            selectedUrl = allHeadlines[0].url;
        }

        // 4. EXTRACTION PHASE
        const article = await scraper.scrape(selectedUrl, { instruction });

        // 5. AUTO-ANALYSIS (Optional, scraper.scrape with smart strategy + key might do it, 
        // but we want to return structure expected by frontend)
        // If the scraper.scrape didn't return analysis (because we didn't pass key to it in the right way or it's optional),
        // we might do manual analysis here using `scraper.analyze` if needed.
        // But our `NewsScraper` takes key in constructor! So `scrape` *should* strictly speaking just scrape.
        // Wait, looking at `NewsScraper.scrape` implementation: it returns `{ article }`. It DOES NOT automatically analyze unless we uncommented that part.
        // The frontend expects `{ article, analysis }`.

        let analysis = null;
        if (article) {
            analysis = await scraper.analyze(article.article, instruction || 'Analyze this news', deepseek_key);
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
