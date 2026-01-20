import React from 'react';
import { NAVIGATION_LINKS, SOCIAL_LINKS, OTHER_LINKS } from "@/lib/config";
import HashtagIcon from "@/assets/svgs/HashtagIcon";
import IconLoader from "../bases/IconLoader";

export default function Footer() {
    return (
        <footer className="w-full border-t border-editorial-200 dark:border-editorial-800 bg-base-100 pt-20 pb-12 mt-32">
            <div className="container mx-auto px-4">
                <div className="footer text-base-content items-start gap-12">
                    <aside className="grid-flow-row gap-6 max-w-sm">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-serif font-bold tracking-tighter">
                                <span className="text-secondary">Nexo</span>visión
                            </span>
                        </div>
                        <p className="text-editorial-600 dark:text-editorial-400 text-sm leading-relaxed font-sans">
                            Periodismo con identidad propia. Informamos desde Chile con una perspectiva global y el compromiso de la verdad.
                        </p>
                    </aside>

                    <nav>
                        <h6 className="footer-title opacity-100 font-sans font-bold tracking-widest text-secondary uppercase text-xs mb-4">Navegación</h6>
                        <a href="/" className="link link-hover text-editorial-700 dark:text-editorial-300 hover:text-secondary">Inicio</a>
                        <a href="/articles" className="link link-hover text-editorial-700 dark:text-editorial-300 hover:text-secondary">Artículos</a>
                        {NAVIGATION_LINKS.map(({ href, text }, index) => (
                            <a key={index} href={href} className="link link-hover text-editorial-700 dark:text-editorial-300 hover:text-secondary">
                                {text}
                            </a>
                        ))}
                    </nav>

                    <nav>
                        <h6 className="footer-title opacity-100 font-sans font-bold tracking-widest text-secondary uppercase text-xs mb-4">Social & Legal</h6>
                        <div className="flex flex-wrap gap-4 mb-6">
                            {SOCIAL_LINKS.map(({ href, icon, text }, index) => (
                                <a
                                    key={index}
                                    href={href}
                                    className="text-2xl text-editorial-400 hover:text-secondary transition-all transform hover:-translate-y-1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={text}
                                >
                                    {icon && <IconLoader icon={icon} />}
                                </a>
                            ))}
                        </div>
                        <nav className="flex flex-col gap-3">
                            {OTHER_LINKS.map(({ href, text }, index) => (
                                <a key={index} href={href} className="link link-hover text-xs text-editorial-400 hover:text-secondary">
                                    {text}
                                </a>
                            ))}
                        </nav>
                    </nav>
                </div>

                <div className="divider border-editorial-100 dark:border-editorial-900 mt-12 opacity-50"></div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50 font-medium">
                    <p>© {new Date().getFullYear()} Nexovisión. Todos los derechos reservados.</p>
                    <p>Construido con <a href="https://github.com/float-js/float-js" className="underline hover:text-primary">Float.js</a></p>
                </div>
            </div>
        </footer>
    );
}
