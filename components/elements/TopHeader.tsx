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
        <div className="navbar border-b border-primary-content/80 dark:border-primary-content/20">
            <div className="navbar-start lg:w-1/2">
                <MenuDropdown currentPath={currentPath} />
                <a className="text-xl px-2 text-nowrap lg:hidden" href="/">{SITE.title}</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <a className="text-xl px-2" href="/">{SITE.title}</a>
            </div>
            <div className="navbar-end">
                {/* <ThemeController /> */}
                <a className="btn btn-ghost btn-circle" href="/search" aria-label="Search">
                    <SearchIcon />
                </a>
                <a
                    className="btn btn-ghost btn-circle"
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
