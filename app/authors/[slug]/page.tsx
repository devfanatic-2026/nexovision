import React from 'react';
import { authorsHandler } from '../../../lib/handlers/authors';
import { articlesHandler } from '../../../lib/handlers/articles';
import WideCard from '../../../components/cards/WideCard';
import HeaderSection from '../../../components/shared/HeaderSection';

// Float page component
export default function AuthorProfilePage({ params }: { params: { slug: string } }) {
    const author = authorsHandler.findAuthor(params.slug);

    if (!author) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-4xl font-bold">404 - Autor no encontrado</h1>
            </div>
        );
    }

    const allArticles = articlesHandler.allArticles();
    const articles = allArticles.filter(article => {
        if (!article.data.authors) return false;
        // authors can be string[] or {id:string}[]
        return article.data.authors.some((a: any) => a === author.id || a.id === author.id);
    });

    const HEADER_TITLE = `Artículos de ${author.data.name}`;

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <HeaderSection title={HEADER_TITLE} />

            <section className="flex-1">
                <ul className="flex flex-col gap-4">
                    {articles.map((article, index) => (
                        <WideCard
                            key={article.id}
                            article={article}
                            isLast={index === articles.length - 1}
                        />
                    ))}
                </ul>
                {articles.length === 0 && (
                    <p className="text-center py-8 opacity-70">Este autor aún no ha publicado artículos.</p>
                )}
            </section>
        </div>
    );
}
