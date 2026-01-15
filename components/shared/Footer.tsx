import React from 'react';
import { NAVIGATION_LINKS, SOCIAL_LINKS, OTHER_LINKS } from "@/lib/config";
import HashtagIcon from "@/assets/svgs/HashtagIcon";
import IconLoader from "../bases/IconLoader";

export default function Footer() {
    return (
        <footer className="w-full border-t border-primary-content/20 bg-base-100 pt-16 pb-8 mt-32">
            <div className="container mx-auto px-4">
                <div className="footer text-base-content items-start">
                    <aside className="grid-flow-row gap-4">
                        <div className="flex items-center gap-2">
                            <HashtagIcon />
                            <strong className="text-2xl font-serif italic tracking-tight">Nexovisión</strong>
                        </div>
                        <p className="max-w-xs text-sm opacity-70 leading-relaxed">
                            Tu portal de noticias independiente. Informando con veracidad y compromiso desde el corazón de la red.
                        </p>
                    </aside>

                    <nav>
                        <h6 className="footer-title opacity-100 font-bold text-primary">Navegación</h6>
                        <a href="/" className="link link-hover">Inicio</a>
                        <a href="/articles" className="link link-hover">Artículos</a>
                        {NAVIGATION_LINKS.map(({ href, text }, index) => (
                            <a key={index} href={href} className="link link-hover">
                                {text}
                            </a>
                        ))}
                    </nav>

                    <nav>
                        <h6 className="footer-title opacity-100 font-bold text-primary">Social</h6>
                        <div className="grid grid-flow-col gap-4">
                            {SOCIAL_LINKS.map(({ href, icon, text }, index) => (
                                <a
                                    key={index}
                                    href={href}
                                    className="text-2xl hover:text-primary transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={text}
                                >
                                    {icon && <IconLoader icon={icon} />}
                                </a>
                            ))}
                        </div>
                        <div className="mt-4">
                            <h6 className="footer-title opacity-100 font-bold text-primary mb-2">Legal</h6>
                            <nav className="flex flex-col gap-2">
                                {OTHER_LINKS.map(({ href, text }, index) => (
                                    <a key={index} href={href} className="link link-hover text-xs opacity-60">
                                        {text}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </nav>
                </div>

                <div className="divider opacity-10 mt-8"></div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50 font-medium">
                    <p>© {new Date().getFullYear()} Nexovisión. Todos los derechos reservados.</p>
                    <p>Construido con <a href="https://github.com/float-js/float-js" className="underline hover:text-primary">Float.js</a></p>
                </div>
            </div>
        </footer>
    );
}
