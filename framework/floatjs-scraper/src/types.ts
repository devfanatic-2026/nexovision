export interface ScrapeOptions {
    /** Only return main text content, stripping navigation/ads */
    mainContentOnly?: boolean;
    /** Included in system prompt for analysis engines */
    instruction?: string;
    /** Force specific engine strategy */
    strategy?: 'smart' | 'fetch-only' | 'browser-only';
}

export interface ScrapedArticle {
    url: string;
    title: string;
    content: string;
    textContent: string;
    length: number;
    excerpt?: string;
    byline?: string;
    dir?: string;
    siteName?: string;
    publishedTime?: string;
    lang?: string;
}

export interface EntityExtraction {
    people: string[];
    organizations: string[];
    media: string[];
    summary: string;
    sentiment?: 'positive' | 'negative' | 'neutral';
    topics?: string[];
}

export interface AnalysisResult {
    article: ScrapedArticle;
    analysis?: EntityExtraction;
}

export interface Headline {
    title: string;
    url: string;
    source?: string;
    image?: string;
}

export interface ScanResult {
    headlines: Headline[];
    source: string;
}
