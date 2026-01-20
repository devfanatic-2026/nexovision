import type { Link } from "../types";

export const SITE = {
    title: "Nexovisión",
    description: "A news website built with Float",
    author: "Mohammad Rahmani",
    url: "https://nexovision.site", // Placeholder or from ENV
    github: "https://github.com/Mrahmani71/astro-news",
    locale: "es-ES",
    dir: "ltr",
    charset: "UTF-8",
    basePath: "/",
    postsPerPage: 4,
};

export const NAVIGATION_LINKS: Link[] = [
    {
        href: "/categories/region",
        text: "Región",
    },
    {
        href: "/categories/police",
        text: "Policial",
    },
    {
        href: "/categories/world",
        text: "Mundo",
    },
    {
        href: "/categories/magazine",
        text: "Magazine",
    },
    {
        href: "/categories/trends",
        text: "Tendencias",
    },
    {
        href: "/categories/sports",
        text: "Deportes",
    },
    {
        href: "/categories/economy",
        text: "Economía",
    },
];

export const OTHER_LINKS: Link[] = [
    {
        href: "/about",
        text: "Sobre nosotros",
    },
    {
        href: "/authors",
        text: "Autores",
    },
    {
        href: "/contact",
        text: "Contacto",
    },
    {
        href: "/privacy",
        text: "Privacidad",
    },
    {
        href: "/terms",
        text: "Términos",
    },
    {
        href: "/cookie-policy",
        text: "Política de Cookies",
    },
];

export const SOCIAL_LINKS: Link[] = [
    {
        href: "https://github.com",
        text: "GitHub",
        icon: "github",
    },
    {
        href: "https://twitter.com",
        text: "Twitter",
        icon: "newTwitter",
    },
];
