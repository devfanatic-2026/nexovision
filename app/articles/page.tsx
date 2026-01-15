import React from 'react';
import { articlesHandler } from '@/lib/handlers/articles';
import NewsCard from '@/components/cards/NewsCard';
import HeaderSection from '@/components/shared/HeaderSection';

export default function ArticlesIndexPage() {
    const articles = articlesHandler.allArticles();
    const INITIAL_LIMIT = 6;
    const PAGE_SIZE = 10;

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <HeaderSection title="Todos los Artículos" />
            <div id="articles-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                    <div
                        key={article.id}
                        className={`article-item ${index >= INITIAL_LIMIT ? 'hidden' : ''}`}
                        data-index={index}
                    >
                        <NewsCard article={article} index={index} />
                    </div>
                ))}
            </div>

            {articles.length > INITIAL_LIMIT && (
                <div className="flex justify-center pt-8">
                    <button
                        id="load-more-btn"
                        className="btn btn-primary btn-outline px-8"
                        data-limit={INITIAL_LIMIT}
                        data-total={articles.length}
                        data-page-size={PAGE_SIZE}
                    >
                        Cargar más artículos
                    </button>
                </div>
            )}

            <script dangerouslySetInnerHTML={{
                __html: `
                const btn = document.getElementById('load-more-btn');
                if (btn) {
                    btn.addEventListener('click', () => {
                        let currentLimit = parseInt(btn.getAttribute('data-limit'));
                        const pageSize = parseInt(btn.getAttribute('data-page-size'));
                        const total = parseInt(btn.getAttribute('data-total'));
                        
                        const newLimit = currentLimit + pageSize;
                        const items = document.querySelectorAll('.article-item');
                        
                        items.forEach((item, index) => {
                            if (index < newLimit) {
                                item.classList.remove('hidden');
                            }
                        });
                        
                        btn.setAttribute('data-limit', newLimit);
                        if (newLimit >= total) {
                            btn.style.display = 'none';
                        }
                    });
                }
            `}} />
        </div>
    );
}
