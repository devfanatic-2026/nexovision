import React from 'react';
import type { Icon } from "@/lib/types";

export default function SearchIcon({
    width = "20",
    height = "20",
    color = "currentColor",
    strokeWidth = "1.5",
    size,
}: Icon) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size ? size : width}
            height={size ? size : height}
            color={color}
            fill="none"
        >
            <path
                d="M17.5 17.5L22 22"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
            <path
                d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
            ></path>
        </svg>
    );
}
