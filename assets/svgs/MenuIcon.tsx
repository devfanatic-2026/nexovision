import React from 'react';
import { NAVIGATION_LINKS, OTHER_LINKS } from "@/lib/config";

export default function MenuIcon({
    size = "20",
    strokeWidth = "1.5",
}: { size?: string; strokeWidth?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            color="currentColor"
            fill="none"
        >
            <path
                d="M4 5L20 5"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M4 12L20 12"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M4 19L20 19"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
}
