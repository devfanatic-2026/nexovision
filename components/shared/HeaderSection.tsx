import React from 'react';

interface Props {
    title: string;
    subtitle?: string;
    link_title?: string;
    link_url?: string;
}

export default function HeaderSection({ title, subtitle, link_title, link_url }: Props) {
    return (
        <div className="flex flex-col gap-1 mb-6">
            <div className="flex items-end justify-between border-b border-base-300 pb-2">
                <h2 className="text-2xl font-serif font-bold tracking-tight text-neutral">
                    {title}
                </h2>
                {link_url ? (
                    <a
                        href={link_url}
                        className="group block h-6 overflow-hidden min-w-[180px] text-right"
                    >
                        <div className="flex flex-col items-end transition-transform duration-500 ease-in-out group-hover:-translate-y-6">
                            <div className="h-6 flex items-center text-[10px] font-sans font-bold uppercase tracking-widest text-secondary whitespace-nowrap">
                                {link_title || "Ver más"} →
                            </div>
                            <div className="h-6 flex items-center text-secondary italic text-xs whitespace-nowrap">
                                {subtitle}
                            </div>
                        </div>
                    </a>
                ) : (
                    subtitle && (
                        <p className="text-xs font-sans italic text-secondary/70">
                            {subtitle}
                        </p>
                    )
                )}
            </div>
        </div>
    );
}
