import React from 'react';

interface Props {
    title: string;
    link_title?: string;
    link_url?: string;
}

export default function HeaderSection({ title, link_title, link_url }: Props) {
    return (
        <div className="flex items-center justify-between border-b border-base-300 pb-2 mb-4">
            <h2 className="text-2xl font-serif font-bold italic">{title}</h2>
            {link_title && link_url && (
                <a href={link_url} className="text-sm font-semibold hover:underline">
                    {link_title}
                </a>
            )}
        </div>
    );
}
