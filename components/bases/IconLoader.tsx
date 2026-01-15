import React from 'react';
import GithubIcon from "@/assets/svgs/GithubIcon";
// Import other icons as needed. For now, we'll map them.
import SearchIcon from "@/assets/svgs/SearchIcon";
import MenuIcon from "@/assets/svgs/MenuIcon";

interface Props {
    icon: string;
    size?: string;
}

export default function IconLoader({ icon, size = "20" }: Props) {
    switch (icon) {
        case 'github':
            return <GithubIcon size={size} />;
        case 'search':
            return <SearchIcon size={size} />;
        case 'menu':
            return <MenuIcon size={size} />;
        // Add more cases here as you convert them
        default:
            return null;
    }
}
