import React from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export const metadata = {
    title: 'Nexovisión | Tu portal de noticias',
    description: 'Nexovisión es un portal de noticias moderno construido con Float.js.',
    lang: 'es',
};

export default function RootLayout({ children, currentPath = '' }: { children: React.ReactNode; currentPath?: string }) {
    return (
        <>
            <head>
                <meta name="color-scheme" content="light" />
                <meta name="theme-color" content="#ffffff" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
                <link rel="stylesheet" href="/styles.css" />
            </head>
            <div id="root" className="min-h-screen flex flex-col bg-base-100 text-base-content overflow-x-hidden">
                {!currentPath.includes('mobile/menu') && <Header currentPath={currentPath} />}
                <main className="flex-grow">
                    {children}
                </main>
                {!currentPath.includes('mobile/menu') && <Footer />}
            </div>
        </>
    );
}
