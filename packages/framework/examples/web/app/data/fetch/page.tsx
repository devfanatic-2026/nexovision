/**
 * Data Fetching Example
 * Demonstrates useFloatData hook for async data loading
 */

'use client';

import { useFloatData } from '@float.js/core';
import { db } from '../../../data/database';
import { useState } from 'react';

// Simulated fetch function
const fetchProducts = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Latency
    return db.products.findAll();
};

export default function DataFetchingPage() {
    // In a real app: useFloatData(fetchProducts)
    // Here we simulate the hook's behavior since we are in a pure React environment for the showcase
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchProducts();
            setData(result);
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    // Auto-load on mount
    useState(() => {
        loadData();
    });

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <a href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Examples
                </a>
                <h1 className="text-3xl font-bold text-gray-900">Data Fetching</h1>
                <p className="text-gray-600 mt-2">Async data loading with loading states and error handling</p>
            </div>

            <div className="flex justify-end mb-6">
                <button
                    onClick={loadData}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition disabled:opacity-50"
                >
                    <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {loading ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </div>

            {loading && data.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white rounded-xl shadow p-6 animate-pulse">
                            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center text-red-600">
                    <p className="font-bold text-lg mb-2">Error Loading Data</p>
                    <p>{error}</p>
                    <button onClick={loadData} className="mt-4 text-red-700 underline">Try Again</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((product: any) => (
                        <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="h-56 overflow-hidden relative bg-gray-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-xs font-bold text-gray-700 shadow-sm">
                                    ${product.price}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium capitalize">{product.category}</span>
                                </div>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-1 text-yellow-500 text-sm">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
                                        <span className="font-medium text-gray-700">{product.rating}</span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">{product.stock} in stock</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
