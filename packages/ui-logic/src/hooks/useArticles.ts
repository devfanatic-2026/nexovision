import { useEffect, useCallback } from 'react';
import { createFloatStore } from "@float.js/lite";
import { usePaginationStore } from '../components/PaginatorContainer';

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
    pageSize: number;
}

const useArticleStore = createFloatStore<ArticleStoreState>({
    articles: [],
    total: 0,
    loading: false,
    error: null,
    pageSize: 10,
});

interface UseArticlesOptions {
    limit?: number;
}

export function useArticles({ limit = 10 }: UseArticlesOptions = {}) {
    const state = useArticleStore();
    const { articles, total, loading, error } = state;
    const { currentPage } = usePaginationStore();

    // Sync store with options if they change
    useEffect(() => {
        useArticleStore.setState({ pageSize: limit });
    }, [limit]);

    const loadPage = useCallback((page: number) => {
        const { pageSize } = useArticleStore.getState();
        useArticleStore.setState({ loading: true });

        // Pure Mock Implementation
        setTimeout(() => {
            const allItems = Array.from({ length: 30 }, (_, i) => ({
                id: `mock-${i + 1}`,
                title: `Mock Article ${i + 1}`,
                description: `This is a description for mock article ${i + 1}.`,
                published_time: new Date().toISOString(),
                cover: `https://picsum.photos/id/${i}/200/300`
            }));

            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const pageItems = allItems.slice(start, end);

            useArticleStore.setState({
                articles: pageItems,
                total: allItems.length,
                loading: false,
                error: null
            });
        }, 500);
    }, []);

    // Load page when currentPage changes
    useEffect(() => {
        loadPage(currentPage);
    }, [currentPage, loadPage]);

    return {
        articles,
        total,
        currentPage,
        loading,
        error,
        totalPages: Math.ceil(total / limit),
        loadPage: (page: number) => usePaginationStore.setState({ currentPage: page })
    };
}

