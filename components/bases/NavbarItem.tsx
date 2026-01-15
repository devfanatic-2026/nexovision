import React from 'react';
import type { Link } from '@/lib/types';

interface Props {
    item: Link;
    currentPath: string;
}

export default function NavbarItem({ item, currentPath }: Props) {
    function isActive(item: Link, currentPath: string = "") {
        if (!currentPath) return false;
        if (item.href === "/" && currentPath === "/") return true;
        if (item.href !== "/" && currentPath.startsWith(item.href)) return true;
        return false;
    }

    function formatHref(href: string) {
        // Aseguramos que las rutas sean consistentes
        return href;
    }

    const active = isActive(item, currentPath);

    return (
        <li
            className={`relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:transition-all after:duration-300 ${active
                ? "after:bg-secondary text-secondary"
                : "after:bg-transparent hover:after:bg-editorial-300"
                }`}
        >
            <a href={formatHref(item.href)} aria-label={item.text} className="px-3 py-2">{item.text}</a>
        </li>
    );
}
