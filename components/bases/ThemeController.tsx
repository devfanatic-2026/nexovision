'use client';

import React, { useEffect, useState } from 'react';
import SunIcon from "@/assets/svgs/SunIcon";
import MoonIcon from "@/assets/svgs/MoonIcon";

export default function ThemeController() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const savedTheme = (localStorage.getItem("astro-theme") as 'light' | 'dark') || "light";
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTheme = e.target.checked ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("astro-theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    return (
        <label className="btn btn-ghost btn-circle swap swap-rotate" htmlFor="theme-controller">
            <input
                type="checkbox"
                className="theme-controller"
                value="dark"
                name="theme-controller"
                id="theme-controller"
                checked={theme === 'dark'}
                onChange={handleToggle}
            />
            <SunIcon />
            <MoonIcon />
            <span className="sr-only">Toggle theme</span>
        </label>
    );
}
