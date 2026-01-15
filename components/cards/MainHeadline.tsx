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
                <div>
                    <h2 className="text-xl font-semibold lg:group-hover:underline underline-offset-2">
                        <a href={`/articles/${article.id}`}>
                            <span className="absolute inset-0 z-10 pointer-events-none"></span>
                            {article.data.title}
                        </a>
                    </h2>
                    <p className="text-base-content/90 text-base max-w-lg">
                        {article.data.description}
                    </p>
                </div>
                <div className="flex items-center text-xs text-base-content/80 mt-2">
                    <span className="text-primary dark:text-secondary">{categoryTitle}</span>
                    <Divider />
                    <span>{getDisplayDate(article.data.publishedTime)}</span>
                </div>
            </div>
        </article>
    );
}
