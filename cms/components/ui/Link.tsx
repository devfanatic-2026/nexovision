'use client';
import React from 'react';
import { useFloatRouter } from '@float.js/core';
import { clsx } from 'clsx';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: React.ReactNode;
}

export function Link({ href, children, className, onClick, ...props }: LinkProps) {
    const router = useFloatRouter();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        // Allow default behavior for modifier keys (new tab, new window, etc.)
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
            return;
        }

        e.preventDefault();

        if (onClick) {
            onClick(e);
        }

        router.push(href);
    };

    return (
        <a href={href} className={className} onClick={handleClick} {...props}>
            {children}
        </a>
    );
}
