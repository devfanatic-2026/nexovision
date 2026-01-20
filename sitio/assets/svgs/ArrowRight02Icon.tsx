import React from 'react';

export default function ArrowRight02Icon({
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
                d="M9 6L15 12L9 18"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
}
