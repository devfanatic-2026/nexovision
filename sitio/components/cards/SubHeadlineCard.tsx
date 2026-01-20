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
        };
        lastModified?: string;
    };
    isFirst?: boolean;
    isLast?: boolean;
}

// ...

// ...

export default function SubHeadlineCard({ article, isFirst, isLast }: Props) {
    const categoryTitle = categoriesHandler.oneCategory(article.data.category.id).data.title;

    return (
        <article
            className={`group py-2 flex items-stretch gap-2 relative isolate ${isFirst ? "pt-0" : "pt-2"
                } ${isLast ? "border-b-0 pb-0" : "border-b border-editorial-100 dark:border-editorial-900"}`}
        >
            <div className="flex flex-col flex-1">
                <div className="flex flex-col gap-1 mb-1">
                    <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-wider text-secondary/80">
                        <span>{categoryTitle}</span>
                        <span className="text-editorial-400 font-medium tracking-normal">{getDisplayDate(article.data.publishedTime)}</span>
                    </div>
                    <h3 className="text-base font-serif font-bold leading-tight lg:group-hover:underline underline-offset-2 decoration-secondary/50">
                        <a href={`/articles/${article.id}`}>
                            <span className="absolute inset-0 z-10 pointer-events-none"></span>
                            {article.data.title}
                        </a>
                    </h3>
                    <p className="text-sm text-editorial-600 dark:text-editorial-400 line-clamp-2 font-sans leading-snug">
                        {article.data.description}
                    </p>
                </div>
            </div>

            <div className="overflow-hidden w-[165px] h-[125px] md:w-[120px] md:h-full shrink-0 rounded-md">
                <img
                    src={article.data.cover}
                    alt={article.data.covert_alt || article.data.title}
                    loading="eager"
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                />
            </div>
        </article>
    );
}
