/**
 * Root Layout for Float.js Showcase (Web)
 * Demonstrates SSR with Tailwind CSS
 */

import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Float.js Showcase - Web Examples</title>
                <meta name="description" content="Complete examples demonstrating Float.js framework capabilities" />
            </head>
            <body className="bg-gray-50 min-h-screen">
                <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">F</span>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Float.js Showcase</h1>
                                    <p className="text-sm text-gray-500">Web Examples (@float.js/core)</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    v1.0.0
                                </span>
                                <a
                                    href="https://github.com/maravilla-digital/maravilla-cms"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>

                <footer className="bg-white border-t border-gray-200 mt-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <p className="text-center text-sm text-gray-500">
                            Built with ❤️ by Alejandro Iglesias | Float.js v1.0.0
                        </p>
                    </div>
                </footer>
            </body>
        </html>
    );
}
