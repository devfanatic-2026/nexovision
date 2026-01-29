import { useEffect, useCallback } from 'react';
import { createFloatStore, realtime } from "@float.js/lite";

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
        useArticleStore.setState({ pageSize: limit });
    }, [limit]);

    const loadPage = useCallback((page: number) => {
        useArticleStore.setState({ loading: true });

        const wsUrl = url.replace('http', 'ws') + '/ws';
        const client = (realtime as any).client({ url: wsUrl, autoReconnect: true });

        client.connect().then(() => {
            console.log('🔌 Connected to cms-rt WebSockets at', wsUrl);
            client.emit('articles:list', { payload: { page, limit: pageSize } });
        }).catch((err: any) => {
            useArticleStore.setState({
                loading: false,
                error: 'Connection failed'
            });
        });

        client.on('articles:list:response', (data: any) => {
            useArticleStore.setState({
                articles: data.articles,
                total: data.total,
                loading: false,
                error: null,
                currentPage: page
            });
            client.disconnect();
        });

        client.on('error', (err: any) => {
            useArticleStore.setState({
                loading: false,
                error: typeof err === 'string' ? err : 'Unknown error'
            });
            client.disconnect();
        });
    }, [url, pageSize]);

    // Initial load
    useEffect(() => {
        loadPage(currentPage);
    }, []);

    return {
        articles,
        total,
        currentPage,
        loading,
        error,
        totalPages: Math.ceil(total / limit),
        loadPage: (page: number) => {
            useArticleStore.setState({ currentPage: page });
            loadPage(page);
        }
    };
}