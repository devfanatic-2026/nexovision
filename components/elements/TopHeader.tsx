import React from 'react';
import GithubIcon from "@/assets/svgs/GithubIcon";
import SearchIcon from "@/assets/svgs/SearchIcon";
import MenuDropdown from "./MenuDropdown";
import { SITE } from "@/lib/config";
// import ThemeController from "../bases/ThemeController";

interface Props {
    currentPath: string;
}

export default function TopHeader({ currentPath }: Props) {
    return (
        <div className="navbar border-b border-base-200 bg-base-100">
            <div className="navbar-start lg:w-1/2">
                <MenuDropdown currentPath={currentPath} />
                <a className="text-2xl font-serif font-bold tracking-tighter px-2 text-nowrap lg:hidden" href="/">
                    <span className="text-secondary">Nexo</span>visión
                </a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <a className="text-3xl font-serif font-bold tracking-tighter px-2 transition-colors hover:text-secondary/80" href="/">
                    <span className="text-secondary">Nexo</span>visión
                </a>
            </div>
            <div className="navbar-end gap-2">
                {/* <ThemeController /> */}
                <a className="btn btn-ghost btn-circle btn-sm md:btn-md" href="/search" aria-label="Search">
                    <SearchIcon />
                </a>
                <a
                    className="btn btn-ghost btn-circle btn-sm md:btn-md"
                    href={SITE.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                >
                    <GithubIcon />
                </a>
            </div>
        </div>
    );
}
