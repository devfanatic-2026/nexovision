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
            className={`relative after:absolute after:-bottom-2 after:left-0 after:h-[1.5px] after:w-full after:transition-all after:duration-300 ${active
                ? "after:bg-base-content"
                : "after:bg-transparent"
                }`}
        >
            <a href={formatHref(item.href)} aria-label={item.text}>{item.text}</a>
        </li>
    );
}
