import React from 'react';
import { Article } from '../../lib/handlers/articles';
import MainHeadline from '../cards/MainHeadline';
import SubHeadlineCard from '../cards/SubHeadlineCard';
import HeaderSection from './HeaderSection';

interface Props {
    title: string;
    inspire?: string;
    mainArticle: Article | null;
    subHeadlines: Article[];
    link_url?: string;
    link_title?: string;
    showCategoryPrefix?: boolean;
}

export default function CategoryHeadlineSection({
    title,
    inspire,
    mainArticle,
    subHeadlines,
    link_url,
    link_title,
    showCategoryPrefix = true
}: Props) {
    if (!mainArticle && subHeadlines.length === 0) return null;

    return (
        <section className="container mx-auto px-4 space-y-4">
            <HeaderSection
                title={title}
                subtitle={inspire}
                link_title={link_title || `Ver más`}
                link_url={link_url}
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-10">
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
                    {subHeadlines.length === 0 && (
                        <div className="h-full flex items-center justify-center border border-dashed border-base-content/20 rounded-lg p-8">
                            <p className="text-base-content/40 text-sm italic">Próximamente más noticias...</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
