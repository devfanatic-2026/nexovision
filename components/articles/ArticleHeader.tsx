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
        <section className="mb-12 flex flex-col gap-8 pb-8 border-b border-editorial-100 dark:border-editorial-900">
            <div className="container px-0 max-w-5xl overflow-hidden aspect-[21/9] rounded-sm relative bg-editorial-100 dark:bg-editorial-900">
                <img {...coverProps} className="w-full h-full object-cover transition-transform duration-700 hover:scale-102" />
                {isImpact && (
                    <div className="absolute top-6 left-6 bg-primary text-white px-4 py-1.5 text-[10px] font-sans font-bold uppercase tracking-[0.2em] shadow-2xl z-20 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        Impacto Nexovisión
                    </div>
                )}
            </div>

            <div className="container max-w-5xl space-y-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-[10px] font-sans font-bold uppercase tracking-widest text-secondary">
                        <a href={`/categories/${category.id}`} className="hover:underline bg-secondary/10 px-2 py-1 rounded-sm">
                            {category.data.title}
                        </a>
                        <span className="w-1.5 h-1.5 bg-editorial-200 rounded-full"></span>
                        <span className="text-editorial-500 font-medium tracking-normal lowercase">{readingTime} de lectura</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-serif font-bold leading-[1.1] tracking-tighter text-neutral">
                        {article.data.title}
                    </h1>

                    <p className="text-xl md:text-2xl text-editorial-600 dark:text-editorial-400 font-sans leading-relaxed border-l-4 border-secondary/20 pl-6 italic">
                        {article.data.description}
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-editorial-50 dark:border-editorial-900/50">
                    <div className="flex flex-wrap gap-6">
                        {authors.map((author: any) => {
                            const authorImgProps = image.props({
                                src: author.data.avatar || "/assets/images/default-avatar.jpg",
                                alt: author.data.name,
                                width: 80,
                                height: 80,
                                className: "w-full h-full object-cover",
                                loading: "eager"
                            });

                            return (
                                <div key={author.id} className="flex items-center gap-3">
                                    <a href={`/authors/${author.id}`} className="group flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="w-10 rounded-full border border-editorial-200 group-hover:border-secondary transition-colors">
                                                <img {...authorImgProps} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-serif font-bold group-hover:text-secondary transition-colors leading-none">{author.data.name}</span>
                                            <span className="text-[10px] font-sans font-bold uppercase tracking-tighter text-editorial-400">{author.data.role}</span>
                                        </div>
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-sans font-bold uppercase tracking-widest text-editorial-400">
                        <Calendar04 size="14" />
                        <time dateTime={normalizeDate(article.data.publishedTime)}>
                            {getDisplayDate(article.data.publishedTime)}
                        </time>
                    </div>
                </div>
            </div>
        </section>
    );
}
