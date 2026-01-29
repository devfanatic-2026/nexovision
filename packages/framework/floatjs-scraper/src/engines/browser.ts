import { chromium, Page, Browser } from 'playwright';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import { ScrapedArticle } from '../types';

export class BrowserEngine {
    private browser: Browser | null = null;

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    async getHtml(url: string): Promise<string | null> {
        try {
            if (!this.browser) {
                this.browser = await chromium.launch({ headless: true });
            }

            const context = await this.browser.newContext({
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
            });

            const page = await context.newPage();
            // Block heavy media
            await page.route('**/*.{png,jpg,jpeg,gif,webp,svg,mp4,woff,woff2}', (route) => route.abort());

            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await page.waitForTimeout(2000); // Wait for dynamic content

            const html = await page.content();
            await context.close();

            return html;
        } catch (error) {
            console.error('[BrowserEngine] getHtml Error:', error);
            return null;
        }
    }

    async scrape(url: string): Promise<ScrapedArticle | null> {
        try {
            if (!this.browser) {
                this.browser = await chromium.launch({ headless: true });
            }

            const context = await this.browser.newContext({
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
            });

            const page = await context.newPage();

            // Block images/media for speed
            await page.route('**/*.{png,jpg,jpeg,gif,webp,svg,mp4,woff,woff2}', (route) => route.abort());

            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

            // Wait a moment for dynamic content (SPA hydration)
            await page.waitForTimeout(1000);

            const html = await page.content();

            // Use Readability on the rendered HTML
            const doc = new JSDOM(html, { url });
            const reader = new Readability(doc.window.document);
            const article = reader.parse();

            await context.close();

            if (!article) return null;

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
            console.error('[BrowserEngine] Error:', error);
            return null;
        }
    }
}
