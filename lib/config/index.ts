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
        href: "/categories/technology",
        text: "Tecnología",
    },
    {
        href: "/categories/programming",
        text: "Programación",
    },
    {
        href: "/categories/lifestyle",
        text: "Estilo de vida",
    },
    {
        href: "/categories/productivity",
        text: "Productividad",
    },
    {
        href: "/categories/health",
        text: "Salud",
    },
    {
        href: "/categories/finance",
        text: "Finanzas",
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
