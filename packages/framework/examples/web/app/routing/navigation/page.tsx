/**
 * Programmatic Navigation Example
 * Demonstrates using useRouter (useFloatRouter simulator)
 */

'use client';

import { useState, useEffect } from 'react';

// Simulate Router Hook - in real app import { useFloatRouter } from '@float.js/core';
const useRouter = () => {
    // In a real environment this would hook into the router
    const push = (path: string) => {
        window.location.href = path;
    };
    const replace = (path: string) => {
        window.location.replace(path);
    };
    const back = () => {
        window.history.back();
    };
    return { push, replace, back };
};

export default function NavigationPage() {
    const router = useRouter();
    const [redirectCount, setRedirectCount] = useState(5);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRedirecting && redirectCount > 0) {
            const timer = setInterval(() => {
                setRedirectCount(c => c - 1);
            }, 1000);
            setTimerId(timer);
            return () => clearInterval(timer);
        } else if (isRedirecting && redirectCount === 0) {
            if (timerId) clearInterval(timerId);
            router.push('/'); // Redirect home
        }
    }, [isRedirecting, redirectCount]);

    const startRedirect = () => {
        setIsRedirecting(true);
        setRedirectCount(5);
    };

    const cancelRedirect = () => {
        setIsRedirecting(false);
        setRedirectCount(5);
        if (timerId) clearInterval(timerId);
    };

    return (
        <div className="max-w-xl mx-auto text-center">
            <div className="mb-8 text-left">
                <a href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Examples
                </a>
                <h1 className="text-3xl font-bold text-gray-900">Programmatic Navigation</h1>
                <p className="text-gray-600 mt-2">Using the router hook to navigate via code</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 transition-all duration-300">
                    <h3 className="font-bold text-blue-900 mb-2">Redirect Demo</h3>
                    <p className="text-blue-700 mb-4">Click below to start a programmed navigation sequence.</p>

                    {isRedirecting ? (
                        <div className="space-y-4 animate-pulse">
                            <p className="text-2xl font-bold text-blue-600">
                                Redirecting in {redirectCount}...
                            </p>
                            <button
                                onClick={cancelRedirect}
                                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={startRedirect}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-200 active:scale-95"
                        >
                            Start 5s Timer
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        onClick={() => router.push('/forms/login')}
                        className="p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:text-blue-600 transition group text-left hover:shadow-md"
                    >
                        <span className="block font-medium mb-1 group-hover:underline flex items-center justify-between">
                            Login Page
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </span>
                        <code className="text-xs text-gray-400 block mt-1 bg-gray-50 p-1 rounded">router.push('/forms/login')</code>
                    </button>
                    <button
                        onClick={() => router.push('/state/counter')}
                        className="p-4 border border-gray-200 rounded-xl hover:border-purple-500 hover:text-purple-600 transition group text-left hover:shadow-md"
                    >
                        <span className="block font-medium mb-1 group-hover:underline flex items-center justify-between">
                            Counter App
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </span>
                        <code className="text-xs text-gray-400 block mt-1 bg-gray-50 p-1 rounded">router.push('/state/counter')</code>
                    </button>
                </div>

                <div className="pt-6 border-t border-gray-100">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center justify-center gap-2 mx-auto text-gray-500 hover:text-gray-900 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" /></svg>
                        Go Back History
                    </button>
                </div>
            </div>
        </div>
    );
}
