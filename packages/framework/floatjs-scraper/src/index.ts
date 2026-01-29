import { FetchEngine } from './engines/fetch';
import { BrowserEngine } from './engines/browser';
import { DeepSeekEngine } from './engines/deepseek';
import { ScrapeOptions, AnalysisResult, ScanResult, Headline } from './types';
import * as cheerio from 'cheerio';

export * from './types';

export class NewsScraper {
    private fetchEngine: FetchEngine;
    private browserEngine: BrowserEngine;
    private deepSeekEngine: DeepSeekEngine;

    constructor(deepSeekApiKey?: string) {
        this.fetchEngine = new FetchEngine();
        this.browserEngine = new BrowserEngine();
        this.deepSeekEngine = new DeepSeekEngine(deepSeekApiKey);
    }

    /**
     * Smart Scrape: Tries fast fetch first, falls back to browser if needed.
     */
    async scrape(url: string, options: ScrapeOptions = {}): Promise<AnalysisResult | null> {
        let article = null;

        // Strategy 1: Fast Fetch (Default)
        if (!options.strategy || options.strategy === 'smart' || options.strategy === 'fetch-only') {
            console.log(`[Scraper] Attempting Fetch for ${url}`);
            article = await this.fetchEngine.scrape(url);
        }

        // Strategy 2: Browser Fallback
        if (!article && (options.strategy === 'smart' || options.strategy === 'browser-only')) {
            console.log(`[Scraper] Fetch failed or insufficient. Launching Browser for ${url}`);
            article = await this.browserEngine.scrape(url);
        }

        if (!article) {
            console.error(`[Scraper] Failed to scrape ${url}`);
            return null;
        }

        // Analysis Phase (DeepSeek)
        // We allow passing a key per-request via options if needed, but currently strict typing in options
        // For now, we assume the key was passed in constructor or we skip analysis if not present
        // In the future we can add `apiKey` to ScrapeOptions

        // Use ScrapeOptions instruction for analysis
        let analysis = undefined;
        // Logic: if we have a key in engine, use it. 
        // NOTE: The user requested the key be passed from client for now. 
        // We'll update the `analyze` method to accept it if exposed.
        return { article };
    }

    /**
     * Scan a hub page (e.g., /sports) for headlines.
     * Uses Cheerio for fast parsing of 'a' tags.
     */
    async scan(url: string, options: ScrapeOptions = {}): Promise<ScanResult | null> {
        try {
            console.log(`[Scraper] Scanning ${url} for headlines...`);

            let html: string | null = null;
            let usedBrowser = false;

            // Strategy 1: Fast Fetch
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 12000);

                const response = await fetch(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
                        'Referer': 'https://www.google.com/'
                    },
                    signal: controller.signal
                });
                clearTimeout(timeout);

                if (response.ok) {
                    html = await response.text();
                    // Basic check for anti-bot (Emol sometimes returns empty or tiny page on reset)
                    if (html.length < 1000) {
                        console.warn(`[Scraper] Fetch HTML too short (${html.length} bytes). Might be anti-bot.`);
                        html = null;
                    }
                }
            } catch (fetchError: any) {
                console.warn(`[Scraper] Fetch scan failed for ${url}: ${fetchError.message}. Attempting browser fallback...`);
            }

            // Strategy 2: Browser Fallback (if fetch failed or returned junk)
            if (!html) {
                console.log(`[Scraper] Launching browser for hub scan: ${url}`);
                html = await this.browserEngine.getHtml(url);
                usedBrowser = true;
            }

            if (!html) {
                console.error(`[Scraper] Failed to obtain HTML for ${url}`);
                return null;
            }
            const $ = cheerio.load(html);
            const headlines: Headline[] = [];
            const seenUrls = new Set<string>();

            // Heuristic: Look for links inside common news containers
            // We search for 'a' tags that have substantial text and hrefs
            $('a').each((_, el) => {
                const title = $(el).text().trim();
                let href = $(el).attr('href');

                if (!href || !title || title.length < 15) return; // Skip short links

                // Normalize URL
                try {
                    href = new URL(href, url).href;
                } catch { return; }

                if (
                    seenUrls.has(href) ||
                    href.includes('/tag/') ||
                    href.includes('/author/') ||
                    href.includes('/category/') ||
                    href.includes('facebook.com') ||
                    href.includes('twitter.com') ||
                    href.includes('javascript:')
                ) return;

                // HEURISTIC: Skip navigation menus, footers, and sidebars
                // Check if any parent indicates navigation
                const parents = $(el).parents();
                let isNav = false;
                parents.each((_, p) => {
                    const tagline = ($(p).prop('tagName') || '').toLowerCase();
                    const cls = ($(p).attr('class') || '').toLowerCase();
                    const id = ($(p).attr('id') || '').toLowerCase();

                    if (['nav', 'header', 'footer', 'aside', 'menu'].includes(tagline)) {
                        isNav = true;
                    }
                    if (cls.includes('menu') || cls.includes('nav') || cls.includes('header') || cls.includes('footer') || cls.includes('sidebar') || cls.includes('breadcrumb')) {
                        isNav = true;
                    }
                    if (id.includes('menu') || id.includes('nav')) isNav = true;
                });
                if (isNav) return;

                // Priority to links inside h1, h2, h3, h4
                const parentTag = $(el).parent().prop('tagName')?.toLowerCase();
                const isHeadline = ['h1', 'h2', 'h3', 'h4', 'article'].some(t =>
                    parentTag === t || $(el).find(t).length > 0
                );

                // If it looks like a headline or is inside a header tag
                if (isHeadline || (title.length > 25 && !title.includes('Leer más'))) {
                    // Try to find an image associated with this link
                    let image: string | undefined = undefined;

                    // Helper to check a node for valid image
                    const checkNodeForImage = (node: any): string | undefined => {
                        // 1. Check direct img tag or descendants
                        const imgs = node.find('img, meta[itemprop="image"]');
                        for (let k = 0; k < imgs.length; k++) {
                            const img = $(imgs[k]);
                            // Check meta content first (highest quality usually)
                            if (img.is('meta')) {
                                const content = img.attr('content');
                                if (content && content.length > 5) return content;
                            }

                            // Check typical lazy load attributes
                            const imgSrc = img.attr('data-src') ||
                                img.attr('data-original') ||
                                img.attr('src') ||
                                // Parse srcset first candidate
                                (img.attr('srcset') || '').split(' ')[0];

                            if (imgSrc && imgSrc.length > 5 && !imgSrc.includes('base64') && !imgSrc.includes('favicon')) {
                                return imgSrc;
                            }
                        }

                        // 2. Check for background-image in style
                        const style = node.attr('style');
                        if (style && style.includes('background-image')) {
                            const match = style.match(/url\(['"]?(.*?)['"]?\)/);
                            if (match && match[1]) return match[1];
                        }
                        return undefined;
                    };

                    // Look in parent container (up to 4 levels) and their immediate siblings
                    let current = $(el);
                    for (let i = 0; i < 4; i++) {
                        const container = current.parent();
                        if (container.length === 0) break;

                        // Check container itself
                        let candidate = checkNodeForImage(container);
                        if (candidate) {
                            try {
                                image = new URL(candidate, url).href;
                                break;
                            } catch { }
                        }

                        // Check previous sibling (common in cards: image div then content div)
                        const prev = container.prev();
                        if (prev.length > 0) {
                            candidate = checkNodeForImage(prev);
                            if (candidate) {
                                try {
                                    image = new URL(candidate, url).href;
                                    break;
                                } catch { }
                            }
                        }

                        current = container;
                    }

                    headlines.push({ title, url: href, source: new URL(url).hostname, image });
                    seenUrls.add(href);
                }
            });

            return {
                source: url,
                headlines: headlines.slice(0, 30) // Limit to top 30 unique
            };

        } catch (error) {
            console.error(`[Scraper] Scan failed for ${url}:`, error);
            return null;
        }
    }

    /**
     * Separate analysis method to be called after scraping or with raw text
     */
    async analyze(article: any, instruction: string, apiKey: string) {
        return this.deepSeekEngine.analyze(article, instruction, apiKey);
    }

    async cleanup() {
        await this.browserEngine.cleanup();
    }
}
