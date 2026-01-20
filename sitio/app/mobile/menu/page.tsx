import React from 'react';
import { categoriesHandler } from "../../../lib/handlers/categories";

/**
 * Mobile Menu Page (SSR + Client Hydration)
 * ----------------------
 */

export default function MobileMenuPage() {
    // 1. Data Fetching
    const categories = categoriesHandler.allCategories();

    return (
        <main className="min-h-screen bg-white text-black font-sans flex flex-col selection:bg-[#00A859]/30">

            {/* Custom Styles for this specific design */}
            <style>{`
                .material-symbols-outlined {
                    font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
                }
                .menu-divider {
                    border-bottom: 0.5px solid #E5E7EB;
                }
                .dark .menu-divider {
                    border-bottom-color: #262626;
                }
                ::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            {/* HEADER: Brand (Matched exactly to Main Site Style) & Close Button */}
            <div className="flex items-center justify-between px-8 pt-10 pb-6 shrink-0 relative z-[10001]">
                <div className="flex-1"></div> {/* Spacer for centering */}

                <div className="flex-1 flex justify-center">
                    <a href="/" className="text-3xl font-serif font-bold tracking-tighter text-nowrap">
                        <span className="text-black">Nexo</span>
                        <span className="text-secondary">visión</span>
                    </a>
                </div>
                <div className="flex-1 flex justify-end">
                    <a
                        href="/"
                        className="w-10 h-10 flex items-center justify-end active:scale-90 transition-transform"
                        aria-label="Cerrar Menú"
                        id="close-menu-link"
                    >
                        <span className="material-symbols-outlined text-4xl text-black">close</span>
                    </a>
                </div>
            </div>

            {/* SEARCH: Squared & Coherent Spacing */}
            <div className="px-8 mb-8 shrink-0">
                <form action="/search" method="GET" className="flex items-center border border-zinc-200 rounded-lg py-5 px-6 bg-zinc-100/30 focus-within:border-[#00A859] focus-within:ring-2 focus-within:ring-[#00A859]/10 transition-all">
                    <span className="material-symbols-outlined text-zinc-400 text-2xl mr-4 leading-none">search</span>
                    <input
                        name="q"
                        className="bg-transparent border-none text-[14px] tracking-wider text-black focus:ring-0 placeholder:text-zinc-400 w-full uppercase font-bold outline-none leading-none"
                        placeholder="Buscar noticias..."
                        type="text"
                    />
                </form>
            </div>

            {/* NAVIGATION LIST: Large Serif Typography */}
            <nav className="flex-1 px-8 scroll-smooth">
                <div className="flex flex-col">
                    {/* Home Item */}
                    <a className="group py-8 menu-divider flex justify-between items-center transition-all" href="/">
                        <span className="text-4xl font-serif font-medium text-black hover:text-[#00A859] transition-colors">
                            Inicio
                        </span>
                    </a>

                    {/* Dynamic Categories */}
                    {categories.map((category) => {
                        const href = `/categories/${category.id}`;
                        return (
                            <a
                                key={category.id}
                                className="group py-8 menu-divider flex justify-between items-center transition-all hover:bg-zinc-50/50 px-2 -mx-2 rounded-lg"
                                href={href}
                            >
                                <span className="text-4xl font-serif text-black group-hover:text-[#00A859] transition-colors">
                                    {category.data.title}
                                </span>
                                <span className="material-symbols-outlined text-zinc-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                    arrow_forward_ios
                                </span>
                            </a>
                        )
                    })}
                </div>
            </nav>

            {/* Removed internal footer as global footer is now maintained */}
            <div className="pb-10"></div>

            {/* Client-side script to handle returnUrl logic */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        (function() {
                            if (typeof window !== 'undefined') {
                                const params = new URLSearchParams(window.location.search);
                                const returnUrl = params.get('returnUrl') || '/';

                                // Update the close button href with the returnUrl
                                const closeLink = document.getElementById('close-menu-link');
                                if (closeLink) {
                                    closeLink.href = returnUrl;
                                }

                                // Add active state highlighting based on current URL
                                const currentPath = window.location.pathname;
                                const navLinks = document.querySelectorAll('nav a');

                                navLinks.forEach(link => {
                                    const href = link.getAttribute('href');
                                    if (href === currentPath || (href === '/' && currentPath === '/')) {
                                        // Add active styling - we'll add this dynamically
                                        if (link.querySelector('span')) {
                                            const span = link.querySelector('span');
                                            span.classList.add('text-[#00A859]', 'italic');
                                            if (href === '/') {
                                                span.classList.add('font-medium');
                                            }

                                            // Add active indicator
                                            if (href === '/') {
                                                const indicator = document.createElement('div');
                                                indicator.className = 'w-2 h-2 rounded-full bg-[#00A859] shadow-[0_0_8px_rgba(0,168,89,0.5)]';
                                                link.appendChild(indicator);
                                            }
                                        }
                                    }
                                });
                            }
                        })();
                    `
                }}
            />

        </main>
    );
}

