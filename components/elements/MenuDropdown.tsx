import React from 'react';
import MenuIcon from "@/assets/svgs/MenuIcon";
import { OTHER_LINKS } from "@/lib/config";
import { categoriesHandler } from "../../lib/handlers/categories";

interface Props {
    currentPath: string;
}

export default function MenuDropdown({ currentPath = "" }: Props) {
    return (
        <div className="dropdown">
            <button
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
                aria-label="Menu"
            >
                <MenuIcon />
            </button>

            <ul
                tabIndex={0}
                className="menu dropdown-content z-50 bg-base-100 rounded-box w-56 shadow"
            >
                <li><a href="/" aria-label="Homepage">Home</a></li>
                <li><a href="/articles" aria-label="Articles Page">Articles</a></li>

                <li>
                    <details>
                        <summary>Categories</summary>
                        <ul>
                            {categoriesHandler.allCategories().map((category) => (
                                <li key={category.id}>
                                    <a
                                        href={`/categories/${category.id}`}
                                        aria-label={category.data.title}
                                        className={currentPath && currentPath === `/categories/${category.id}` ? "active" : ""}
                                    >
                                        {category.data.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </details>
                </li>

                <li>
                    <details>
                        <summary>Other Pages</summary>
                        <ul>
                            {OTHER_LINKS.map(({ href, text }, index) => (
                                <li key={index}>
                                    <a href={href} aria-label={text}>
                                        {text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </details>
                </li>
            </ul>
        </div>
    );
}
