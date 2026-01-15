import React from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export const metadata = {
    title: 'Nexovisión | Tu portal de noticias',
    description: 'Nexovisión es un portal de noticias moderno construido con Float.js.',
    lang: 'es',
};

export default function RootLayout({ children, currentPath }: { children: React.ReactNode, currentPath: string }) {
    return (
        <>
            <head>
                <link rel="stylesheet" href="/styles.css" />
            </head>
            <div id="root" className="min-h-screen flex flex-col bg-base-100 text-base-content overflow-x-hidden">
                <Header currentPath={currentPath} />
                <main className="flex-grow">
                    {children}
                </main>
                <Footer />
            </div>
        </>
    );
}
