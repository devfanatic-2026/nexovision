'use client';

import React from 'react';
import { useFloatData } from '@float.js/core';
import { ArticleEditor } from '../../../../components/ArticleEditor';
import { Button } from '../../../../components/ui/Button';

function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
    );
}

export default function ArticleEditPage({ params }: { params: { slug: string } }) {
    const isNew = params.slug === 'new';

    // FETCHING DATA WITH USEFLOATDATA
    // This hook handles caching, revalidation, and loading states automatically.
    // It's much simpler than manual useEffect + fetch.
    const { data: categories } = useFloatData('/api/categories');
    const { data: articles } = useFloatData(isNew ? null : '/api/articles');

    const loading = !categories || (!isNew && !articles);

    // Find the specific article if we are editing
    const currentArticle = React.useMemo(() => {
        if (isNew || !articles) return undefined;
        return articles.find((a: any) => a.slug === params.slug);
    }, [articles, isNew, params.slug]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!isNew && !currentArticle) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <h2 className="text-xl font-semibold text-gray-900">Artículo no encontrado</h2>
                <a href="/">
                    <Button variant="ghost">
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Volver al inicio
                    </Button>
                </a>
            </div>
        );
    }

    return (
        <ArticleEditor
            isNew={isNew}
            categories={categories || []}
            initialArticle={currentArticle}
        />
    );
}
