import React from 'react';

interface DividerProps {
    className?: string;
    responsive?: boolean;
}

export default function Divider({ className = "", responsive }: DividerProps) {
    return (
        <div className={`mx-2 h-1 w-1 rounded-full bg-base-content/80 ${responsive ? 'hidden lg:block' : ''} ${className}`}></div>
    );
}
