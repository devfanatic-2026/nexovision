/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Paleta "Chile Premium" de Nexovisión
                'chile': {
                    'blue': '#0039A6', // Azul Bandera
                    'red': '#D52B1E',  // Rojo Bandera
                    'paper': '#ffffff', // Blanco puro por defecto
                    'ink': '#1A1A1A',  // Negro casi puro para contraste
                },
                'editorial': {
                    50: '#F9F9F7',
                    100: '#F1F1EF',
                    200: '#E2E2DE',
                    300: '#D1D1CB',
                    400: '#A3A39A',
                    500: '#737367',
                    600: '#5C5C52',
                    700: '#47473F',
                    800: '#2D2D2D',
                    900: '#1A1A17',
                },
            },
            fontFamily: {
                'serif': ['Lora', 'Georgia', 'serif'],
                'sans': ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
                'display': ['Lora', 'serif'],
            },
            fontSize: {
                'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
                'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
                'display-md': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
                'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
            },
            letterSpacing: {
                'tighter': '-0.04em',
                'tight': '-0.02em',
            },
            boxShadow: {
                'editorial': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'editorial-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('daisyui'),
    ],
    daisyui: {
        themes: [
            {
                light: {
                    "primary": "#D52B1E",
                    "secondary": "#0039A6",
                    "accent": "#ffffff",
                    "neutral": "#1A1A1A",
                    "base-100": "#ffffff",
                    "base-200": "#f8f8f8",
                    "base-300": "#f1f1f1",
                    "base-content": "#1A1A17",
                    "info": "#0039A6",
                    "success": "#10b981",
                    "warning": "#f59e0b",
                    "error": "#D52B1E",
                },
            },
        ],
        darkTheme: "light", // Forzar que incluso si se detecta dark use light
    },
}
