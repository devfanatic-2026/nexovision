import React from 'react';
import { categoriesHandler } from '../../../lib/handlers/categories';
import { articlesHandler } from '../../../lib/handlers/articles';
import NewsCard from '../../../components/cards/NewsCard';
import HeaderSection from '../../../components/shared/HeaderSection';
import CategoryHeadlineSection from '../../../components/shared/CategoryHeadlineSection';

export default function CategoryPage({ params }: { params: { slug: string } }) {
    try {
        const category = categoriesHandler.oneCategory(params.slug);
        const catMain = articlesHandler.mainHeadline(params.slug);
        const catSubs = articlesHandler.subHeadlines(params.slug);

        const headlineIds = new Set([catMain?.id, ...catSubs.map(s => s.id)].filter(Boolean) as string[]);

        const allCategoryArticles = articlesHandler.allArticles().filter(a => a.data.category.id === params.slug);
        const remainingArticles = allCategoryArticles.filter(a => !headlineIds.has(a.id));

        const INITIAL_LIMIT = 6;
        const PAGE_SIZE = 10;

        return (
            <div className="space-y-12 pb-12">
                {/* Category Featured Section */}
                <div className="pt-8">
                    <CategoryHeadlineSection
                        title={category.data.title}
                        inspire={category.data.inspire}
                        mainArticle={catMain}
                        subHeadlines={catSubs}
                        showCategoryPrefix={true}
                    />
                </div>

                <div className="container mx-auto px-4 space-y-8">
                    <HeaderSection title="Más noticias de esta categoría" />

                    <div id="category-articles-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {remainingArticles.map((article, index) => (
                            <div
                                key={article.id}
                                className={`category-article-item ${index >= INITIAL_LIMIT ? 'hidden' : ''}`}
                                data-index={index}
                            >
                                <NewsCard article={article} index={index} />
                            </div>
                        ))}
                    </div>

                    {remainingArticles.length === 0 && !catMain && (
                        <p className="text-center py-12 text-base-content/60">No se encontraron artículos en esta categoría.</p>
                    )}

                    {remainingArticles.length > INITIAL_LIMIT && (
                        <div className="flex justify-center pt-8">
                            <button
                                id="load-more-cat-btn"
                                className="btn btn-primary btn-outline px-8"
                                data-limit={INITIAL_LIMIT}
                                data-total={remainingArticles.length}
                                data-page-size={PAGE_SIZE}
                            >
                                Cargar más artículos
                            </button>
                        </div>
                    )}
                </div>

                <script dangerouslySetInnerHTML={{
                    __html: `
                    const btn = document.getElementById('load-more-cat-btn');
                    if (btn) {
                        btn.addEventListener('click', () => {
                            let currentLimit = parseInt(btn.getAttribute('data-limit'));
                            const pageSize = parseInt(btn.getAttribute('data-page-size'));
                            const total = parseInt(btn.getAttribute('data-total'));
                            
                            const newLimit = currentLimit + pageSize;
                            const items = document.querySelectorAll('.category-article-item');
                            
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
    } catch (e) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-4xl font-bold">404 - Categoría no encontrada</h1>
            </div>
        );
    }
}
