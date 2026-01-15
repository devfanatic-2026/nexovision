import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
}

export const Time04: React.FC<IconProps> = ({ size = 20, width, height, ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size || width || 20}
            height={size || height || 20}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            {...props}
        >
            <circle cx="12" cy="12" r="10" stroke="currentColor"></circle>
            <path
                d="M9.5 9.5L12.9999 12.9996M16 8L11 13"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    );
};
