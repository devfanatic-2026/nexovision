import React from 'react';
import Divider from "../bases/Divider";
import { categoriesHandler } from '../../lib/handlers/categories';
import { getDisplayDate } from '../../lib/utils/date';

interface Props {
    article: {
        id: string;
        data: {
            title: string;
            description: string;
            category: { id: string };
            cover: string;
            covert_alt?: string;
            publishedTime: string;
            isMainHeadline?: boolean;
        };
        minutesRead?: string;
    };
    index: number;
    showImpactBadge?: boolean;
}

export default function NewsCard({ article, index, showImpactBadge }: Props) {
    const categoryTitle = categoriesHandler.oneCategory(article.data.category.id).data.title;
    const isImpact = showImpactBadge && article.data.isMainHeadline;

    return (
        <article className="col-span-1 group w-full flex flex-col gap-2 h-full relative isolate">
            <div className="aspect-video overflow-hidden rounded-md relative">
                <img
                    src={article.data.cover}
                    alt={article.data.covert_alt || article.data.title}
                    loading={index < 3 ? "eager" : "lazy"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {isImpact && (
                    <div className="absolute top-2 left-2 bg-chile-red text-white px-2 py-1 text-[10px] font-sans font-bold uppercase tracking-widest shadow-lg z-20 flex items-center gap-1.5 rounded-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        Impacto
                    </div>
                )}
            </div>
            <div className="flex flex-col flex-1 gap-1">
                <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-wider text-secondary/70">
                    <span>{categoryTitle}</span>
                    <span className="w-1 h-1 bg-editorial-200 rounded-full"></span>
                    <span className="text-editorial-400 font-medium tracking-normal lowercase">{article.minutesRead || '5 min'}</span>
                </div>
                <h3 className="text-xl font-serif font-bold leading-tight group-hover:underline decoration-secondary/30 underline-offset-4 line-clamp-2">
                    <a href={`/articles/${article.id}`}>
                        <span className="absolute inset-0 z-10 pointer-events-none"></span>
                        {article.data.title}
                    </a>
                </h3>
                <p className="text-sm text-editorial-600 dark:text-editorial-400 line-clamp-3 text-pretty font-sans leading-relaxed mb-auto">
                    {article.data.description}
                </p>
                <div className="flex items-center text-[10px] font-sans text-editorial-400 uppercase tracking-tight mt-2 opacity-80">
                    {getDisplayDate(article.data.publishedTime)}
                </div>
            </div>
        </article>
    );
}
