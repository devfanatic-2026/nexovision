import React from 'react';

export default function HashtagIcon({
    size = "32",
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
                d="M10 3L6 21"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M18 3L14 21"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M3 8H21"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M3 16H21"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
}
