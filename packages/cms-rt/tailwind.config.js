/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        '../packages/ui-kit/**/*.{js,ts,jsx,tsx}',
        '../packages/ui-logic/**/*.{js,ts,jsx,tsx}',
        '../packages/widgets/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
