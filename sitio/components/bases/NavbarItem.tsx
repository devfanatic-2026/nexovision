import React from 'react';
import type { Link } from '@/lib/types';
import { useFloatRouter } from '@float.js/core';

interface Props {
    item: Link;
}

export default function NavbarItem({ item }: Props) {
    const { pathname, query } = useFloatRouter();

    const isActive = () => {
        // Use pathname, or fallback to returnUrl if we are on the menu
        const effectivePath = (pathname === '/mobile/menu' && query.returnUrl)
            ? query.returnUrl
            : pathname;

        if (!effectivePath) return false;

        if (item.href === "/" && effectivePath === "/") return true;
        // Strict path checking + prefix match for sub-routes
        if (item.href !== "/" && (effectivePath === item.href || effectivePath.startsWith(item.href + '/'))) return true;
        return false;
    };

    return (
        <li
            className={`relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:transition-all after:duration-300 ${isActive()
                ? "after:bg-secondary text-secondary"
                : "after:bg-transparent hover:after:bg-editorial-300"
                }`}
        >
            <a href={item.href} aria-label={item.text} className="px-3 py-2">{item.text}</a>
        </li>
    );
}
