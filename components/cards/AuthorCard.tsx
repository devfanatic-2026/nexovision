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
        <li className="group relative isolate mx-auto w-full list-none">
            {/* Wrap image in a link for robust clickability */}
            <a href={`/authors/${author.id}`} className="block aspect-square w-full overflow-hidden rounded-md bg-base-200" tabIndex={-1}>
                <img
                    className="h-full w-full object-cover filter grayscale transition-all duration-300 group-hover:grayscale-0"
                    src={author.data.avatar}
                    alt={author.data.name}
                    loading="lazy"
                />
            </a>
            <div className="flex flex-col gap-0.5 mt-2">
                <h3 className="text-base font-semibold group-hover:underline">
                    <a href={`/authors/${author.id}`} className="focus:outline-none">
                        {/* Expanded click area for the rest of the card */}
                        <span className="absolute inset-0 z-10" aria-hidden="true"></span>
                        {author.data.name}
                    </a>
                </h3>
                <p className="text-sm text-primary dark:text-secondary">
                    {author.data.job || author.data.role}
                </p>
            </div>
        </li>
    );
}
