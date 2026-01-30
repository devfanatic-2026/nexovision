import React from 'react';

export function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
            <div className="mb-10">
                <h1 className="text-2xl font-bold text-blue-600">NexoVision</h1>
                <p className="text-xs text-gray-500 font-mono">WIDGET CATALOG</p>
            </div>

            <nav className="flex-1 space-y-2">
                <a href="/" className="nav-link flex items-center gap-3 p-2 rounded hover:bg-gray-100/50 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Home
                </a>
                <a href="/articles" className="nav-link flex items-center gap-3 p-2 rounded hover:bg-gray-100/50 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    Realtime Articles
                </a>
                <a href="#" className="nav-link flex items-center gap-3 p-2 rounded opacity-50 cursor-not-allowed">
                    <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                    Weather Widget
                </a>
                <a href="#" className="nav-link flex items-center gap-3 p-2 rounded opacity-50 cursor-not-allowed">
                    <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                    Stock Ticker
                </a>
            </nav>

            <div className="pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-400">Powered by Float.js Core</p>
            </div>
        </aside>
    );
}
