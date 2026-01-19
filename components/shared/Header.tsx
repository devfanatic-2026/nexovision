import React from 'react';
import TopHeader from "../elements/TopHeader";
import Navbar from "../elements/Navbar";

export default function Header({ currentPath = '' }: { currentPath?: string }) {
    return (
        <header className="border-b border-editorial-200 dark:border-editorial-800 bg-base-100">
            <TopHeader currentPath={currentPath} />
            <Navbar currentPath={currentPath} />
        </header>
    );
}
