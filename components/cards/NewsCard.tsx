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
                    <div className="absolute top-2 right-2 bg-primary text-primary-content px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg z-20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        Impacto
                    </div>
                )}
            </div>
            <div className="flex flex-col flex-1">
                <h3 className="text-xl font-serif font-semibold lg:group-hover:underline line-clamp-2">
                    <a href={`/articles/${article.id}`}>
                        <span className="absolute inset-0 z-10 pointer-events-none"></span>
                        {article.data.title}
                    </a>
                </h3>
                <p className="text-sm text-base-content/80 line-clamp-3 text-pretty lg:mb-auto">
                    {article.data.description}
                </p>
                <div className="flex items-center text-xs text-base-content/80 mt-2">
                    <span className="text-xs text-primary dark:text-secondary">
                        {categoryTitle}
                    </span>
                    <Divider />
                    <span className="text-xs text-base-content/80">
                        {article.minutesRead || '5 min read'}
                    </span>
                    <Divider />
                    <span className="text-xs text-base-content/80">
                        {getDisplayDate(article.data.publishedTime)}
                    </span>
                </div>
            </div>
        </article>
    );
}
