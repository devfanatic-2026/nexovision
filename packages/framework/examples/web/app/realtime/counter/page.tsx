/**
 * Live Counter Example
 * Demonstrates shared state across clients
 */

'use client';

import { useState, useEffect } from 'react';

// Mock shared state
let sharedCount = 0;
const listeners = new Set<(count: number) => void>();

const updateCount = (newCount: number) => {
    sharedCount = newCount;
    listeners.forEach(l => l(sharedCount));
};

const useSharedCounter = () => {
    const [count, setCount] = useState(sharedCount);

    useEffect(() => {
        const handler = (newCount: number) => setCount(newCount);
        listeners.add(handler);
        return () => { listeners.delete(handler); };
    }, []);

    return {
        count,
        increment: () => updateCount(sharedCount + 1),
        decrement: () => updateCount(sharedCount - 1),
    };
};

export default function SharedCounterPage() {
    const { count, increment, decrement } = useSharedCounter();
    const [lastUpdate, setLastUpdate] = useState<string>('');

    useEffect(() => {
        setLastUpdate(new Date().toLocaleTimeString());
    }, [count]);

    return (
        <div className="max-w-xl mx-auto text-center">
            <div className="mb-8 text-left">
                <a href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Examples
                </a>
                <h1 className="text-3xl font-bold text-gray-900">Live Counter</h1>
                <p className="text-gray-600 mt-2">Shared state synchronized across clients (Simulator)</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>

                <div className="mb-8">
                    <span className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600 select-none transition-all scale-100 hover:scale-110 duration-200 inline-block">
                        {count}
                    </span>
                    <p className="text-sm text-gray-400 mt-4">Last update: {lastUpdate}</p>
                </div>

                <div className="flex justify-center gap-6">
                    <button
                        onClick={decrement}
                        className="w-16 h-16 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 text-2xl transition-all active:scale-95"
                    >
                        -
                    </button>
                    <button
                        onClick={increment}
                        className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white text-2xl transition-all shadow-lg shadow-blue-200 active:scale-95"
                    >
                        +
                    </button>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 text-sm text-gray-500">
                    <p>Open this page in another tab to see it sync!</p>
                    <p className="text-xs text-gray-400 mt-1">(Simulated sharing via memory in this build)</p>
                </div>
            </div>
        </div>
    );
}
