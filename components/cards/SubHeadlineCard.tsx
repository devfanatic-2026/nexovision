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
                } ${isLast ? "border-b-0 pb-0" : "border-b border-base-300"}`}
        >
            <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1">
                        <h3 className="text-base lg:group-hover:underline mb-1">
                            <a href={`/articles/${article.id}`}>
                                <span className="absolute inset-0 z-10 pointer-events-none"></span>
                                {article.data.title}
                            </a>
                        </h3>
                        <p className="text-sm text-base-content/80 text-balance line-clamp-2">
                            {article.data.description}
                        </p>
                    </div>
                </div>
                <div className="flex items-center text-xs text-base-content/80 mt-1 lg:mt-auto">
                    <span className="text-primary dark:text-secondary">{categoryTitle}</span>
                    <Divider />
                    <span>{getDisplayDate(article.data.publishedTime)}</span>
                </div>
            </div>

            <div className="overflow-hidden w-[165px] h-[125px] md:w-[120px] md:h-full shrink-0">
                <img
                    src={article.data.cover}
                    alt={article.data.covert_alt || article.data.title}
                    loading="eager"
                    className="object-cover rounded w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
            </div>
        </article>
    );
}
