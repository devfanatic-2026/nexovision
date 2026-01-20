import React from 'react';
import Divider from "../bases/Divider";
import { getDisplayDate, normalizeDate } from "../../lib/utils/date";

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
    };
    isLast: boolean;
}

export default function WideCard({ article, isLast }: Props) {
    const categoryTitle = article.data.category.id;

    return (
        <li className="group w-full max-w-md mx-auto lg:max-w-full relative isolate flex flex-col lg:flex-row gap-4">
            <div className="flex-shrink-0 aspect-square w-32 text-sm text-base-content/60 text-pretty capitalize hidden lg:flex pt-1">
                {getDisplayDate(article.data.publishedTime)}
            </div>
            <div className={`flex-1 flex flex-col gap-4 lg:flex-row-reverse pb-2 lg:pb-4 ${isLast ? "border-b-0" : "border-b border-base-300"}`}>
                <div className="w-full lg:w-60 aspect-video">
                    <img
                        src={article.data.cover}
                        alt={article.data.covert_alt || article.data.title}
                        loading="eager"
                        className="aspect-video rounded w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-semibold lg:group-hover:underline">
                        <a href={`/articles/${article.id}`}>
                            <span className="absolute inset-0 z-10"></span>
                            {article.data.title}
                        </a>
                    </h3>
                    <p className="text-base-content/80 max-w-xl text-pretty">
                        {article.data.description}
                    </p>
                </div>
                <div className="text-sm lg:hidden flex items-center text-base-content/70 pt-2">
                    <time className="flex items-center gap-1" dateTime={normalizeDate(article.data.publishedTime)}>
                        <span>{getDisplayDate(article.data.publishedTime)}</span>
                    </time>
                    <Divider />
                    <small className="flex items-center gap-1">
                        <span className="capitalize text-sm">{categoryTitle}</span>
                    </small>
                </div>
            </div>
        </li>
    );
}
