/**
 * Combined Stores Example
 * Demonstrates combining multiple stores into a selector-based hook
 */

'use client';

import { createFloatStore } from '@float.js/core';
import { useState } from 'react';

// Store 1: User Profile
const useUserStore = createFloatStore({
    name: 'Alex Developer',
    isPremium: true,
    credits: 50,
});

// Store 2: Shopping Cart
const useCartStore = createFloatStore({
    items: [] as Array<{ id: number; name: string; price: number }>,
    isOpen: false,
});

export default function CombinedStoresPage() {
    const user = useUserStore();
    const cart = useCartStore();

    // Local state to avoid hydration mismatch in this simple example
    const [mounted, setMounted] = useState(false);

    // Hydration fix
    if (!mounted && typeof window !== 'undefined') {
        setMounted(true);
    }

    const addItem = (price: number) => {
        if (user.credits >= price) {
            // Transaction: Deduct credits AND add to cart
            useUserStore.setState({ credits: user.credits - price });
            useCartStore.setState({
                items: [...cart.items, { id: Date.now(), name: 'Premium Widget', price }],
                isOpen: true
            });
        } else {
            alert('Not enough credits!');
        }
    };

    const clearCart = () => {
        const totalRefund = cart.items.reduce((acc, item) => acc + item.price, 0);
        useUserStore.setState({ credits: user.credits + totalRefund });
        useCartStore.setState({ items: [] });
    };

    // Hydration safety
    if (!mounted) return null;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <a href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Examples
                </a>
                <h1 className="text-3xl font-bold text-gray-900">Combined Stores</h1>
                <p className="text-gray-600 mt-2">Managing interactions between multiple global stores</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* User Store Panel */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-between">
                        User Store
                        <span className="text-xs font-normal px-2 py-1 bg-gray-100 rounded text-gray-500">Global State</span>
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <div className="font-semibold">{user.name}</div>
                                <div className="text-sm text-yellow-600 font-medium">{user.isPremium ? 'Premium Member' : 'Free User'}</div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                            <span className="text-gray-600">Available Credits</span>
                            <span className="text-2xl font-bold text-green-600">{user.credits}</span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => useUserStore.setState({ credits: user.credits + 10 })}
                                className="flex-1 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                            >
                                +10 Credits
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cart Store Panel */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-orange-500">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-between">
                        Cart Store
                        <span className="text-xs font-normal px-2 py-1 bg-gray-100 rounded text-gray-500">Global State</span>
                    </h2>

                    <div className="space-y-4">
                        <div className="min-h-[100px] bg-gray-50 rounded-lg p-4">
                            {cart.items.length === 0 ? (
                                <p className="text-center text-gray-400 py-8">Cart is empty</p>
                            ) : (
                                <ul className="space-y-2">
                                    {cart.items.map(item => (
                                        <li key={item.id} className="flex justify-between text-sm">
                                            <span>{item.name}</span>
                                            <span className="font-bold">{item.price}c</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                            <span className="text-gray-600 font-medium">Total</span>
                            <span className="text-xl font-bold text-gray-900">
                                {cart.items.reduce((acc, i) => acc + i.price, 0)}c
                            </span>
                        </div>

                        {cart.items.length > 0 && (
                            <button
                                onClick={clearCart}
                                className="w-full py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                            >
                                Clear & Refund
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Interaction Zone */}
            <div className="mt-8 bg-gray-900 rounded-xl p-8 text-center text-white">
                <h3 className="text-xl font-bold mb-2">Buy Items (Inter-Store Transaction)</h3>
                <p className="text-gray-400 mb-6 max-w-lg mx-auto">
                    Clicking buy will: 1. Deduct from User Store credits, 2. Add to Cart Store items.
                    If credits are insufficient, the transaction fails.
                </p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => addItem(10)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition shadow-lg shadow-blue-900/50"
                    >
                        Buy Widget (10c)
                    </button>
                    <button
                        onClick={() => addItem(25)}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition shadow-lg shadow-purple-900/50"
                    >
                        Buy Super Widget (25c)
                    </button>
                </div>
            </div>
        </div>
    );
}
