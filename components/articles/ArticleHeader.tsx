import React from 'react';
import { categoriesHandler } from '../../lib/handlers/categories';
import { authorsHandler } from '../../lib/handlers/authors';
import { articlesHandler } from '../../lib/handlers/articles';
import { formatDate, normalizeDate, getDisplayDate } from '../../lib/utils/date';
import { ResourcesAdd } from '../icons/ResourcesAdd';
import { Calendar04 } from '../icons/Calendar04';
import { Time04 } from '../icons/Time04';
import Divider from '../bases/Divider';
import { image } from '@float.js/core';

// Configure Float images
image.configure({
    quality: 80,
});

interface ArticleHeaderProps {
    article: any;
    readingTime: string;
}

export default function ArticleHeader({ article, readingTime }: ArticleHeaderProps) {
    const category = categoriesHandler.oneCategory(article.data.category.id);
    const authors = authorsHandler.getAuthors(article.data.authors);
    const mainHeadline = articlesHandler.mainHeadline();
    const isImpact = article.data.isMainHeadline && mainHeadline.id !== article.id;

    const coverProps = image.props({
        src: article.data.cover,
        alt: article.data.cover_alt || "article cover",
        width: 1200,
        height: 540,
        className: "w-full h-full object-cover object-center",
        loading: "eager"
    });

    return (
        <section className="mb-8 flex flex-col lg:flex-col-reverse border-b border-b-base-300 lg:border-none pb-4 pt-0 lg:pt-6">
            <div className="container px-0 max-w-5xl lg:mt-4 overflow-hidden aspect-[20/9] lg:rounded-md relative">
                <img {...coverProps} />
                {isImpact && (
                    <div className="absolute top-4 right-4 bg-primary text-primary-content px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-2xl z-20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        Impacto Nexovisión
                    </div>
                )}
            </div>
            <div className="container my-4 max-w-5xl lg:hidden flex items-center gap-2">
                <ResourcesAdd size="16" />
                <a href={`/categories/${category.data.path}`} className="a-01 font-semibold">
                    {category.data.title}
                </a>
            </div>
            <div className="container max-w-5xl">
                <h1 className="text-3xl lg:text-4xl font-bold text-left text-pretty">
                    {article.data.title}
                </h1>
                <div className="flex flex-col gap-4 items-start mt-2 lg:mt-6 text-sm">
                    <div className="text-base-content/70 flex items-center gap-2">
                        <span className="hidden lg:flex items-center gap-1">
                            <ResourcesAdd size="15" />
                            <a href={`/categories/${category.id}`} className="a-01 font-semibold">
                                {category.data.title}
                            </a>
                        </span>
                        <Divider responsive />
                        <span className="flex items-center gap-1">
                            <Calendar04 size="15" />
                            <time dateTime={normalizeDate(article.data.publishedTime)}>
                                {getDisplayDate(article.data.publishedTime)}
                            </time>
                        </span>
                        <Divider />
                        <span className="flex items-center gap-1">
                            <Time04 size="15" />
                            <span>{readingTime}</span>
                        </span>
                    </div>

                    <div className="w-full flex flex-wrap gap-2 items-center justify-between">
                        <div className="flex flex-wrap gap-4">
                            {authors.map((author: any) => {
                                const authorImgProps = image.props({
                                    src: author.data.avatar || "/assets/images/default-avatar.jpg",
                                    alt: author.data.name,
                                    width: 64,
                                    height: 64,
                                    className: "w-full h-full object-cover",
                                    loading: "eager"
                                });

                                return (
                                    <div key={author.id} className="flex items-center gap-2">
                                        <a href={`/authors/${author.id}`} className="flex items-center gap-2">
                                            <div className="avatar">
                                                <div className="w-8 rounded-full">
                                                    <img {...authorImgProps} />
                                                </div>
                                            </div>
                                            <span className="font-bold capitalize">{author.data.name}</span>
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                        {/* <Share text={article.data.title} /> */}
                    </div>
                </div>
            </div>
        </section>
    );
}
