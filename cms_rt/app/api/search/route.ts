import { NewsScraper, ScanResult, Headline } from '@float.js/scraper';
import { LLMClient, type LLMProvider } from '../../../lib/llm';
import fs from 'fs';
import path from 'path';

// Mapping categories to Chilean/Global news hubs
const CATEGORY_HUBS: Record<string, string[]> = {
    'general': [
        'https://www.biobiochile.cl/lista/categorias/region-de-coquimbo',
        'https://www.diarioeldia.cl/',
        'https://www.emol.com/nacional'
    ],
    'deportes': [
        'https://www.emol.com/deportes',
        'https://www.latercera.com/canal/el-deportivo/',
        'https://www.alairelibre.cl/',
        'https://www.biobiochile.cl/lista/categorias/deportes'
    ],
    'economia': [
        'https://www.df.cl/',
        'https://www.emol.com/economia',
        'https://www.latercera.com/pulso/',
        'https://www.biobiochile.cl/lista/categorias/economia'
    ],
    'mundo': [
        'https://www.emol.com/internacional',
        'https://www.latercera.com/canal/mundo/',
        'https://elpais.com/internacional/',
        'https://www.biobiochile.cl/lista/categorias/internacional'
    ],
    'tecnologia': [
        'https://www.latercera.com/que-pasa/',
        'https://www.xataka.com/',
        'https://www.biobiochile.cl/lista/categorias/ciencia-y-tecnologia'
    ],
    'cultura': [
        'https://www.latercera.com/culto/',
        'https://www.emol.com/espectaculos',
        'https://www.biobiochile.cl/lista/categorias/artes-y-cultura'
    ],
    'policial': [
        'https://www.biobiochile.cl/lista/categorias/policial',
        'https://www.emol.com/nacional'
    ]
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { query, category, excludeUrls = [], provider = 'gemini', apiKey } = body;

        console.log(`[Search] Category: ${category}, Query: ${query}, Exclude: ${excludeUrls.length} urls`);

        const scraper = new NewsScraper();
        // Provider specific key or environment key
        const client = new LLMClient(provider as LLMProvider, apiKey);

        // 1. Select Hubs
        const catKey = (category || 'general')
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""); // Remove accents

        let possibleHubs = CATEGORY_HUBS[catKey] || CATEGORY_HUBS['general'];
        // Shuffle and pick 3 for better coverage
        const hubsToScan = possibleHubs.sort(() => 0.5 - Math.random()).slice(0, 3);

        // 2. Scan
        const scanPromises = hubsToScan.map(url => scraper.scan(url));
        const results = await Promise.all(scanPromises);

        // 3. Flatten
        let allHeadlines: Headline[] = [];
        results.forEach((res: ScanResult | null) => {
            if (res && res.headlines) {
                allHeadlines.push(...res.headlines);
            }
        });

        // 4. Initial Filter (Deduplication and Exclude list)
        const excludeSet = new Set(excludeUrls.map((u: string) => u.toLowerCase()));
        const uniqueHeadlines = allHeadlines.filter((h, index, self) =>
            h.url &&
            !excludeSet.has(h.url.toLowerCase()) &&
            index === self.findIndex(t => t.url.toLowerCase() === h.url.toLowerCase())
        );

        if (uniqueHeadlines.length === 0) {
            return new Response(JSON.stringify({ results: [] }), { headers: { 'Content-Type': 'application/json' } });
        }

        // 5. AI Selection & Quality Filtering (The "Agent Intelligence" part)
        let finalItems: any[] = [];

        // Check if we can use AI (Key exists or using Gemini environment key)
        const canUseAI = (provider === 'gemini') || (apiKey || process.env.DEEPSEEK_API_KEY);

        if (canUseAI) {
            try {
                // Try to load category contract
                let contract = "";
                try {
                    const contractPath = path.join(process.cwd(), 'contracts', `${catKey === 'policial' ? 'police' : catKey}.md`);
                    if (fs.existsSync(contractPath)) {
                        contract = fs.readFileSync(contractPath, 'utf-8');
                    }
                } catch (e) { console.warn('Could not read contract for AI filter'); }

                const headlinesBrief = uniqueHeadlines.map((h, i) => `${i}. [${h.source}] ${h.title}`).join('\n');

                const prompt = `
                Act as a News Curator for a high-quality outlet. 
                Category: ${category}
                Query/Context: ${query}
                
                ${contract ? `Category Guidelines:\n${contract}\n` : ''}
                
                Headlines found:
                ${headlinesBrief}
                
                TASK:
                1. Select the most relevant and high-quality headlines.
                2. Group headlines that belong to the SAME EVENT or STORY into a "Topic".
                3. For each Topic, generate:
                   - A "synthetic_title": A professional headline that encompasses all sources in that topic.
                   - A "synthetic_description": A 2-sentence summary of the news story based on the sources.
                4. Return a JSON object with a "groups" array.
                
                Example Output:
                {
                  "groups": [
                    { 
                      "synthetic_title": "Modernización de semáforos en La Serena y Coquimbo",
                      "synthetic_description": "Las autoridades anuncian una inversión de 3 mil millones para renovar 40 semáforos, buscando mejorar el flujo vehicular y la seguridad peatonal.",
                      "indices": [0, 5, 8],
                      "topic": "Semáforos Coquimbo"
                    }
                  ]
                }
                `;

                const aiResponse = await client.chat({
                    system: 'You are an expert news editor. Output JSON.',
                    messages: [{ role: 'user', content: prompt }],
                    response_format: 'json_object'
                });

                const content = aiResponse.content.replace(/```json/g, '').replace(/```/g, '');
                const groups = JSON.parse(content).groups;

                // Map back to NewsItem structure (Group -> News -> Sources)
                groups.forEach((g: any) => {
                    const sources: any[] = [];
                    let firstImage = "";

                    g.indices.forEach((idx: number) => {
                        const h = uniqueHeadlines[idx];
                        if (h) {
                            if (!firstImage && h.image) firstImage = h.image;
                            sources.push({
                                url: h.url,
                                source: h.source || new URL(h.url).hostname,
                                title: h.title,
                                snippet: h.title, // Use title as snippet fallback
                                image: h.image // Pass image per source too
                            });
                        }
                    });

                    // Favicon fallback if no real image found in group
                    if (!firstImage && sources.length > 0) {
                        firstImage = `https://www.google.com/s2/favicons?domain=${sources[0].url}&sz=128`;
                    }

                    if (sources.length > 0) {
                        finalItems.push({
                            id: crypto.randomUUID(),
                            title: g.synthetic_title,
                            snippet: g.synthetic_description,
                            topic: g.topic,
                            image: firstImage,
                            sources: sources,
                            date: new Date().toISOString().split('T')[0]
                        });
                    }
                });

            } catch (aiError) {
                console.error('AI Filtering failed, falling back to basic filter:', aiError);
                // Fallback to basic string filter if AI fails
            }
        }

        // Fallback or Basic mode if AI skipped/failed
        if (finalItems.length === 0) {
            const cleanQuery = query?.replace('Noticias recientes', '').trim();
            const q = cleanQuery?.toLowerCase();

            finalItems = uniqueHeadlines
                .filter(h => {
                    if (!q || q.length < 3 || catKey === q) return true; // Don't filter if query is just the category
                    return h.title.toLowerCase().includes(q);
                })
                .slice(0, 20)
                .map(h => ({
                    title: h.title,
                    snippet: `Noticia encontrada en ${h.source}`,
                    url: h.url,
                    source: h.source || new URL(h.url).hostname,
                    image: `https://www.google.com/s2/favicons?domain=${h.url}&sz=128`,
                    id: h.url
                }));
        }

        return new Response(JSON.stringify({
            results: finalItems
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Search API Critical Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to search', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
