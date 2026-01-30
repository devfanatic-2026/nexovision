/**
 * Pagination Example
 * Demonstrates infinite scroll behavior
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../../../data/database';

export default function PaginationPage() {
    const [items, setItems] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef<HTMLDivElement>(null);

    const ITEMS_PER_PAGE = 5;

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const allArticles = db.articles.findAll();
        // Generate more mock data if needed to scroll
        const extendedArticles = [
            ...allArticles,
            ...allArticles.map(a => ({ ...a, id: a.id + 100, title: a.title + ' (Older)' })),
            ...allArticles.map(a => ({ ...a, id: a.id + 200, title: a.title + ' (Archive)' })),
            ...allArticles.map(a => ({ ...a, id: a.id + 300, title: a.title + ' (Legacy)' })),
        ];

        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const nextItems = extendedArticles.slice(start, end);

        if (nextItems.length === 0) {
            setHasMore(false);
        } else {
            setItems(prev => [...prev, ...nextItems]);
            setPage(prev => prev + 1);
        }
        setLoading(false);
    }, [page, loading, hasMore]);

    // Initial load
    useEffect(() => {
        loadMore();
    }, []);

    // Intersection Observer for Infinite Scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loading, loadMore]);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <a href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Examples
                </a>
                <h1 className="text-3xl font-bold text-gray-900">Infinite Scroll</h1>
                <p className="text-gray-600 mt-2">Auto-loading content as you scroll down</p>
            </div>

            <div className="space-y-6">
                {items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                            <img src={item.coverImage} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Article #{index + 1}</span>
                            <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.excerpt}</p>
                        </div>
                    </div>
                ))}

                <div ref={observerTarget} className="py-8 text-center text-gray-400">
                    {loading && (
                        <div className="flex flex-col items-center gap-2">
                            <svg className="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Loading more content...</span>
                        </div>
                    )}
                    {!hasMore && (
                        <p className="text-sm">No more items to load</p>
                    )}
                </div>
            </div>
        </div>
    );
}
