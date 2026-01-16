import React from 'react';
import { articlesHandler } from '../lib/handlers/articles';
import { authorsHandler } from '../lib/handlers/authors';
import { categoriesHandler } from '../lib/handlers/categories';
import MainHeadline from '../components/cards/MainHeadline';
import SubHeadlineCard from '../components/cards/SubHeadlineCard';
import NewsCard from '../components/cards/NewsCard';
import AuthorCard from '../components/cards/AuthorCard';
import HeaderSection from '../components/shared/HeaderSection';
import CategoryHeadlineSection from '../components/shared/CategoryHeadlineSection';

export default function Home() {
    const mainArticle = articlesHandler.mainHeadline();
    const subHeadlines = articlesHandler.subHeadlines();
    const featuredIds = new Set([mainArticle?.id, ...subHeadlines.map(s => s.id)].filter(Boolean) as string[]);

    const latestArticles = articlesHandler.allArticles()
        .filter(a => !featuredIds.has(a.id))
        .filter(a => a.data.isMainHeadline || a.data.isSubHeadline || a.data.isCategoryMainHeadline || a.data.isCategorySubHeadline)
        .slice(0, 6);
    const topAuthors = authorsHandler.limitAuthors(6);
    const categories = categoriesHandler.allCategories();

    return (
        <div className="relative space-y-12 pb-16">
            {/* Headlines Section */}
            <section className="grid grid-cols-1 gap-6 md:grid-cols-10 container mx-auto px-4 pt-4 md:pt-8">
                <div className="col-span-1 md:col-span-6">
                    {mainArticle && <MainHeadline article={mainArticle} />}
                </div>
                <div className="col-span-1 md:col-span-4 flex flex-col gap-4">
                    {subHeadlines.map((article, index) => (
                        <SubHeadlineCard
                            key={article.id}
                            article={article}
                            isFirst={index === 0}
                            isLast={index === subHeadlines.length - 1}
                        />
                    ))}
                </div>
            </section>

            <div className="container mx-auto px-4">
                <hr className="border-t-2 border-base-300 opacity-50" />
            </div>

            {/* Latest News Section */}
            <section className="container mx-auto px-4 space-y-4">
                <HeaderSection
                    title="Últimas Noticias"
                    link_title="Ver todas"
                    link_url="/articles"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {latestArticles.map((article, index) => (
                        <NewsCard
                            key={article.id}
                            article={article}
                            index={index}
                            showImpactBadge={true}
                        />
                    ))}
                </div>
            </section>

            {/* Category Sections */}
            {categories.map((category) => {
                const categoryArticles = articlesHandler.allArticles()
                    .filter(a => a.data.category.id === category.id)
                    .filter(a => a.data.isMainHeadline || a.data.isSubHeadline || a.data.isCategoryMainHeadline || a.data.isCategorySubHeadline);

                if (categoryArticles.length === 0) return null;

                return (
                    <React.Fragment key={category.id}>
                        <div className="container mx-auto px-4">
                            <hr className="border-t-2 border-base-300 opacity-50" />
                        </div>

                        {categoryArticles.length < 5 ? (
                            <section className="container mx-auto px-4 space-y-4">
                                <HeaderSection
                                    title={category.data.title}
                                    subtitle={category.data.inspire}
                                    link_title="Ver más"
                                    link_url={`/categories/${category.id}`}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {categoryArticles.map((article, index) => (
                                        <NewsCard
                                            key={article.id}
                                            article={article}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </section>
                        ) : (
                            <CategoryHeadlineSection
                                title={category.data.title}
                                inspire={category.data.inspire}
                                mainArticle={articlesHandler.mainHeadline(category.id)}
                                subHeadlines={articlesHandler.subHeadlines(category.id)}
                                link_title="Ver más"
                                link_url={`/categories/${category.id}`}
                            />
                        )}
                    </React.Fragment>
                );
            })}

            <div className="container mx-auto px-4">
                <hr className="border-t-2 border-base-300 opacity-50" />
            </div>

            {/* Authors Section */}
            <section className="container mx-auto px-4 pb-12">
                <HeaderSection title="Autores" link_title="Ver todos" link_url="/authors" />
                <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 mt-4">
                    {topAuthors.map((author) => (
                        <AuthorCard key={author.id} author={author} />
                    ))}
                </ul>
            </section>

            <div className="container mx-auto px-4">
                <hr className="border-t-2 border-base-300 opacity-50" />
            </div>
        </div>
    );
}
