import React from 'react';
import { authorsHandler } from '../../lib/handlers/authors';
import AuthorCard from '../../components/cards/AuthorCard';
import HeaderSection from '../../components/shared/HeaderSection';
import { Info } from '../../components/icons/Info';

export default function AuthorsPage() {
    const authors = authorsHandler.allAuthors();

    // Mocking the "entry" data logic from Astro which came from content collections.
    const HEADER_TITLE = "Nuestros Autores";
    const ATTENTION_DESCRIPTION = "Conoce al equipo detrás de Nexovisión. Periodistas y expertos dedicados a traerte la mejor información.";

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <HeaderSection title={HEADER_TITLE} />

            <section className="bg-editorial-50 dark:bg-editorial-900/40 border border-editorial-100 dark:border-editorial-800 p-6 rounded-sm mb-4">
                <div className="flex items-center gap-3 text-secondary italic font-serif">
                    <Info size="20" />
                    <p className="text-lg">{ATTENTION_DESCRIPTION}</p>
                </div>
            </section>

            <section className="flex-1">
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4">
                    {authors.map((author) => (
                        <AuthorCard key={author.id} author={author} />
                    ))}
                </ul>
            </section>
        </div>
    );
}
