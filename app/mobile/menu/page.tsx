import React, { useEffect, useState } from 'react';
import { categoriesHandler } from "../../../lib/handlers/categories";

/**
 * Mobile Menu Page (SSR + Client Hydration)
 * ----------------------
 */

export default function MobileMenuPage() {
    // 1. Data Fetching
    const categories = categoriesHandler.allCategories();

    // 2. Navigation Logic (Client-Side)
    const [returnUrl, setReturnUrl] = useState('/');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const url = params.get('returnUrl');
            if (url) {
                setReturnUrl(url);
            }
        }
    }, []);

    const isActive = (href: string) => {
        if (href === '/' && returnUrl === '/') return true;
        if (href !== '/' && (returnUrl === href || returnUrl.startsWith(href + '/'))) return true;
        return false;
    };

    return (
        <main className="fixed inset-0 z-[9999] bg-white dark:bg-[#0a0a0a] text-black dark:text-zinc-100 font-sans flex flex-col selection:bg-[#00A859]/30 overflow-hidden">

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

            {/* HEADER: Brand (Matched exactly to Main Site Style: Black + Pink) & Close Button */}
            <div className="flex items-center justify-between px-8 pt-10 pb-6 shrink-0 relative z-[10001]">
                <div className="flex items-center">
                    <span className="text-2xl font-serif font-bold tracking-tighter text-nowrap">
                        <span className="text-black dark:text-white">Nexo</span><span className="text-[#E91E63]">visión</span>
                    </span>
                </div>
                <a
                    href={returnUrl}
                    className="w-10 h-10 flex items-center justify-end active:scale-90 transition-transform"
                    aria-label="Cerrar Menú"
                >
                    <span className="material-symbols-outlined text-4xl text-black dark:text-white">close</span>
                </a>
            </div>

            {/* SEARCH: Squared & Coherent Spacing */}
            <div className="px-8 mb-8 shrink-0">
                <form action="/search" method="GET" className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-lg py-5 px-6 bg-zinc-100/30 dark:bg-zinc-900/40 focus-within:border-[#00A859] focus-within:ring-2 focus-within:ring-[#00A859]/10 transition-all">
                    <span className="material-symbols-outlined text-zinc-400 text-2xl mr-4 leading-none">search</span>
                    <input
                        name="q"
                        className="bg-transparent border-none text-[14px] tracking-wider text-black dark:text-white focus:ring-0 placeholder:text-zinc-400 w-full uppercase font-bold outline-none leading-none"
                        placeholder="Buscar noticias..."
                        type="text"
                    />
                </form>
            </div>

            {/* NAVIGATION LIST: Large Serif Typography */}
            <nav className="flex-1 overflow-y-auto px-8 hide-scrollbar scroll-smooth">
                <div className="flex flex-col">
                    {/* Home Item */}
                    <a className="group py-8 menu-divider flex justify-between items-center transition-all" href="/">
                        <span className={`text-4xl font-serif font-medium transition-colors ${isActive('/')
                            ? 'text-[#00A859] italic'
                            : 'text-black dark:text-white hover:text-[#00A859]'
                            }`}>
                            Inicio
                        </span>
                        {isActive('/') && (
                            <div className="w-2 h-2 rounded-full bg-[#00A859] shadow-[0_0_8px_rgba(0,168,89,0.5)]"></div>
                        )}
                    </a>

                    {/* Dynamic Categories */}
                    {categories.map((category) => {
                        const href = `/categories/${category.id}`;
                        const active = isActive(href);
                        return (
                            <a
                                key={category.id}
                                className="group py-8 menu-divider flex justify-between items-center transition-all hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 px-2 -mx-2 rounded-lg"
                                href={href}
                            >
                                <span className={`text-4xl font-serif transition-colors ${active
                                    ? 'text-[#00A859] italic font-medium'
                                    : 'text-black dark:text-zinc-200 group-hover:text-[#00A859]'
                                    }`}>
                                    {category.data.title}
                                </span>
                                {active ? (
                                    <div className="w-2 h-2 rounded-full bg-[#00A859] shadow-[0_0_8px_rgba(0,168,89,0.5)]"></div>
                                ) : (
                                    <span className="material-symbols-outlined text-zinc-300 dark:text-zinc-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                        arrow_forward_ios
                                    </span>
                                )}
                            </a>
                        )
                    })}
                </div>
            </nav>

            {/* FOOTER: Socials & Utilities */}
            <div className="px-8 pt-8 pb-10 flex flex-col items-center gap-8 bg-white dark:bg-[#0a0a0a] border-t border-zinc-50 dark:border-zinc-900">
                {/* Social Icons (Simplified) */}
                <div className="flex gap-10">
                    <a className="hover:opacity-60 transition-opacity grayscale hover:grayscale-0" href="#" aria-label="Facebook">
                        <span className="material-symbols-outlined text-2xl text-zinc-400">facebook</span>
                    </a>
                    <a className="hover:opacity-60 transition-opacity grayscale hover:grayscale-0" href="#" aria-label="Twitter">
                        <span className="material-symbols-outlined text-2xl text-zinc-400">brand_awareness</span>
                    </a>
                    <a className="hover:opacity-60 transition-opacity grayscale hover:grayscale-0" href="#" aria-label="Instagram">
                        <span className="material-symbols-outlined text-2xl text-zinc-400">camera_alt</span>
                    </a>
                </div>

                {/* Utility Links & Copyright */}
                <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-6">
                        <a className="text-[11px] text-zinc-500 hover:text-[#00A859] tracking-[0.2em] uppercase font-bold transition-colors" href="#">Mi Perfil</a>
                        <a className="text-[11px] text-zinc-500 hover:text-[#00A859] tracking-[0.2em] uppercase font-bold transition-colors" href="#">Suscripción</a>
                    </div>
                    <p className="text-[10px] text-zinc-400 tracking-[0.3em] uppercase font-medium">
                        © {new Date().getFullYear()} Nexovisión Media Group
                    </p>
                </div>

                {/* Minimal bar at bottom for mobile aesthetics */}
                <div className="w-32 h-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-full mt-2"></div>
            </div>

        </main>
    );
}

