import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import { ScrapedArticle } from '../types';

export class FetchEngine {
    private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';

    async scrape(url: string): Promise<ScrapedArticle | null> {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const response = await fetch(url, {
                headers: { 'User-Agent': this.userAgent },
                signal: controller.signal
            });

            clearTimeout(timeout);

            if (!response.ok) {
                console.warn(`[FetchEngine] Failed: ${response.status} ${response.statusText}`);
                return null;
            }

            const html = await response.text();

            // Basic validation: If too short, might be JS block or anti-bot
            if (html.length < 500) return null;

            const doc = new JSDOM(html, { url });
            const reader = new Readability(doc.window.document);
            const article = reader.parse();

            if (!article) return null;

            // Check if content is substantial (Readability sometimes returns empty strings for SPA)
            if (article.textContent.length < 200) return null;

            return {
                url,
                title: article.title,
                content: article.content,
                textContent: article.textContent,
                length: article.length,
                excerpt: article.excerpt,
                byline: article.byline,
                siteName: article.siteName,
                dir: article.dir,
                lang: article.lang
            };

        } catch (error) {
            console.error('[FetchEngine] Error:', error);
            return null;
        }
    }
}
