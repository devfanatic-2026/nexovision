import React from 'react';

export default function MoonIcon({
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
            className="swap-off"
        >
            <path
                d="M21.5 14.0784C20.3003 14.7105 18.9224 15.0621 17.4615 15.0621C12.7482 15.0621 8.92308 11.2369 8.92308 6.52361C8.92308 5.0627 9.27471 3.68481 9.90675 2.48511C6.4443 3.52514 3.92308 6.7297 3.92308 10.5156C3.92308 15.2289 7.74821 19.054 12.4615 19.054C16.2474 19.054 19.452 16.5328 20.492 13.0703C21.4858 13.0703 21.5 14.0784 21.5 14.0784Z"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
}
