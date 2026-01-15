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
}

// ...

// ...

export default function MainHeadline({ article }: Props) {
    const categoryTitle = categoriesHandler.oneCategory(article.data.category.id).data.title;

    return (
        <article className="group relative isolate flex flex-col-reverse md:flex-col gap-4">
            <div className="aspect-video overflow-hidden rounded-md">
                <img
                    src={article.data.cover}
                    alt={article.data.covert_alt || article.data.title}
                    loading="eager"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-secondary">
                        <span className="bg-secondary/10 px-2 py-0.5 rounded-sm">{categoryTitle}</span>
                        <span className="text-editorial-500 font-medium tracking-normal">{getDisplayDate(article.data.publishedTime)}</span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-serif font-bold leading-tight tracking-tight lg:group-hover:underline underline-offset-4 decoration-secondary">
                        <a href={`/articles/${article.id}`}>
                            <span className="absolute inset-0 z-10 pointer-events-none"></span>
                            {article.data.title}
                        </a>
                    </h2>
                    <p className="text-editorial-700 dark:text-editorial-300 text-base md:text-lg font-sans leading-relaxed line-clamp-3">
                        {article.data.description}
                    </p>
                </div>
            </div>
        </article>
    );
}
