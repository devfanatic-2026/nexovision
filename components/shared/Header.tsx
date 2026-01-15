import React from 'react';
import TopHeader from "../elements/TopHeader";
import Navbar from "../elements/Navbar";

export default function Header({ currentPath }: { currentPath: string }) {
    return (
        <header className="border-b border-primary-content/80 dark:border-primary-content/20">
            <TopHeader currentPath={currentPath} />
            <Navbar currentPath={currentPath} />
        </header>
    );
}
