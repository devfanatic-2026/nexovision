import React from 'react';

interface Props {
    author: {
        id: string;
        data: {
            name: string;
            role: string;
            avatar: string;
            job?: string;
        };
    };
}

export default function AuthorCard({ author }: Props) {
    return (
        <li className="group relative isolate mx-auto w-full list-none text-center">
            {/* Wrap image in a link for robust clickability */}
            <a href={`/authors/${author.id}`} className="block aspect-square w-32 md:w-36 mx-auto overflow-hidden rounded-full bg-editorial-100 dark:bg-editorial-900 border-2 border-transparent group-hover:border-secondary transition-all duration-300 shadow-sm group-hover:shadow-md" tabIndex={-1}>
                <img
                    className="h-full w-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-110"
                    src={author.data.avatar}
                    alt={author.data.name}
                    loading="lazy"
                />
            </a>
            <div className="flex flex-col gap-1 mt-4">
                <h3 className="text-base font-serif font-bold group-hover:text-secondary transition-colors">
                    <a href={`/authors/${author.id}`} className="focus:outline-none">
                        {/* Expanded click area for the rest of the card */}
                        <span className="absolute inset-0 z-10" aria-hidden="true"></span>
                        {author.data.name}
                    </a>
                </h3>
                <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-secondary">
                    {author.data.job || author.data.role}
                </p>
            </div>
        </li>
    );
}
