import { createFloatStore, floatMiddleware } from '@float.js/core';

export interface NewsSource {
    url: string;
    source: string;
    title: string;
    snippet: string;
    disabled?: boolean;
}

export interface NewsItem {
    id: string;
    title: string;
    snippet: string;
    image?: string;
    date?: string;
    topic?: string;
    sources: NewsSource[];
}

export interface NewsGroup {
    id: string;
    news: NewsItem[]; // Point 2: 1 or more news items
    selectedIndex: number; // For cycling through news in the group
    selected: boolean;
    linkingReason?: string;
    type?: 'auto' | 'manual' | 'detached';
    isBookmarked?: boolean;
    isConfigured?: boolean;
    preferredImage?: string;
}

interface NewsWorkbenchState {
    newsByCategories: Record<string, NewsGroup[]>;
}

export const useNewsWorkbench = createFloatStore<NewsWorkbenchState>(
    {
        newsByCategories: {},
    },
    {
        persist: 'news-workbench',
        middleware: floatMiddleware.undoable(30),
    }
);
