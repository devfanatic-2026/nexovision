import { useEffect, useCallback } from 'react';
import { createFloatStore, realtime } from "@float.js/core";

export interface Article {
    id: string;
    title: string;
    description: string;
    cover?: string;
    published_time: string;
}

interface ArticleStoreState {
    articles: Article[];
    total: number;
    loading: boolean;
    error: string | null;
    currentPage: number;
    pageSize: number;
}

const useArticleStore = createFloatStore<ArticleStoreState>({
    articles: [],
    total: 0,
    loading: false,
    error: null,
    currentPage: 1,
    pageSize: 10,
});

interface UseRealtimeArticlesOptions {
    url?: string;
    limit?: number;
}

export function useRealtimeArticles({ url = 'http://localhost:3002', limit = 10 }: UseRealtimeArticlesOptions = {}) {
    const state = useArticleStore();
    const { articles, total, loading, error, currentPage, pageSize } = state;

    // Sync store with options if they change
    useEffect(() => {
        if (limit !== pageSize) {
            useArticleStore.setState({ pageSize: limit });
        }
    }, [limit, pageSize]);

    const loadPage = useCallback((page: number) => {
        useArticleStore.setState({ loading: true, error: null });

        const wsUrl = url.replace('http', 'ws') + '/ws';
        const client = (realtime as any).client({ url: wsUrl, autoReconnect: true });

        client.connect().then(() => {
            console.log(`🔌 [WS] Requesting articles (page: ${page}, limit: ${pageSize})`);
            client.emit('articles:list', { page, limit: pageSize });
        }).catch((err: any) => {
            useArticleStore.setState({
                loading: false,
                error: 'Connection failed: ' + (err.message || String(err))
            });
        });

        client.on('articles:list:response', (data: any) => {
            useArticleStore.setState({
                articles: data.articles || [],
                total: data.total || 0,
                loading: false,
                error: null,
                currentPage: page
            });
            client.disconnect();
        });

        client.on('error', (err: any) => {
            useArticleStore.setState({
                loading: false,
                error: typeof err === 'string' ? err : 'Unknown WebSocket error'
            });
            client.disconnect();
        });
    }, [url, pageSize]);

    // Initial load - only if we don't have articles or we are on a different page than the store
    useEffect(() => {
        if (articles.length === 0) {
            loadPage(currentPage);
        }
    }, [url, pageSize]); // Add url/pageSize to trigger reload if they change

    return {
        articles,
        total,
        currentPage,
        loading,
        error,
        totalPages: Math.ceil(total / pageSize),
        loadPage: (page: number) => {
            loadPage(page);
        }
    };
}