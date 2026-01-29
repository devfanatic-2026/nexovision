import { useEffect, useCallback, useRef } from 'react';
import { createFloatStore } from "@float.js/lite";

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
    page: number;
    limit: number;
}

const useArticleStore = createFloatStore<ArticleStoreState>({
    articles: [],
    total: 0,
    loading: false, // Default to false, let the component trigger it
    error: null,
    page: 1,
    limit: 10,
});

// Singleton WebSocket
let singletonWs: WebSocket | null = null;

interface UseRealtimeArticlesOptions {
    url: string;
    limit?: number;
}

export function useRealtimeArticles({
    url,
    limit = 10
}: UseRealtimeArticlesOptions) {
    const state = useArticleStore();
    const { articles, total, loading, error, page } = state;

    // Handle connection only
    useEffect(() => {
        if (!url) return;

        const wsUrl = url.startsWith('http') ? url.replace(/^http/, 'ws') + '/ws' : (url.startsWith('ws') ? url : `ws://${url}/ws`);

        if (singletonWs && (singletonWs.readyState === WebSocket.OPEN || singletonWs.readyState === WebSocket.CONNECTING)) {
            // If already connected to the same URL, do nothing
            if (singletonWs.url.includes(url)) return;
            // Otherwise close and reconnect
            singletonWs.close();
        }

        console.log('🔌 Connecting to CMS-RT WebSocket at', wsUrl);
        const ws = new WebSocket(wsUrl);
        singletonWs = ws;

        ws.onopen = () => {
            console.log('✅ WebSocket connected');
        };

        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                if (msg.type === 'articles:list:response') {
                    const { articles, total, page } = msg.payload;
                    console.log(`📦 Received ${articles?.length || 0} articles via WebSocket`);
                    useArticleStore.setState({
                        articles,
                        total,
                        page,
                        loading: false,
                        error: null
                    });
                } else if (msg.type === 'error') {
                    useArticleStore.setState({ error: msg.payload, loading: false });
                }
            } catch (e) {
                console.error('Failed to parse WS message', e);
            }
        };

        ws.onerror = (err) => {
            console.error('❌ WebSocket error', err);
            useArticleStore.setState({ error: 'WebSocket connection failed', loading: false });
        };

        ws.onclose = () => {
            console.log('👋 WebSocket disconnected');
            if (singletonWs === ws) singletonWs = null;
        };

        return () => {
            // We keep it alive for the singleton, but if the URL changes the next effect will handle it.
        };
    }, [url]);

    const fetchArticles = useCallback((p: number = 1) => {
        const sendMessage = () => {
            if (singletonWs && singletonWs.readyState === WebSocket.OPEN) {
                useArticleStore.setState({ loading: true, page: p });
                singletonWs.send(JSON.stringify({
                    type: 'articles:list',
                    payload: { page: p, limit }
                }));
            } else {
                console.warn('⚠️ WebSocket NOT OPEN yet. Retrying in 500ms...');
                setTimeout(() => fetchArticles(p), 500);
            }
        };
        sendMessage();
        return;
    }, [limit]);

    const setPage = useCallback((newPage: number) => {
        fetchArticles(newPage);
    }, [fetchArticles]);

    return {
        articles,
        total,
        loading,
        error,
        page,
        setPage,
        fetchArticles,
        totalPages: Math.ceil(total / limit)
    };
}