/**
 * Simple Counter Example
 * Demonstrates basic state management with useState
 */

'use client';

import { useState } from 'react';

export default function CounterPage() {
    const [count, setCount] = useState(0);
    const [step, setStep] = useState(1);

    const increment = () => setCount(c => c + step);
    const decrement = () => setCount(c => c - step);
    const reset = () => setCount(0);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <a href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Examples
                </a>
                <h1 className="text-3xl font-bold text-gray-900">Simple Counter</h1>
                <p className="text-gray-600 mt-2">Basic state management with useState</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
                {/* Counter Display */}
                <div className="text-center mb-8">
                    <div className="text-gray-600 text-sm uppercase tracking-wide mb-2">Current Count</div>
                    <div className="text-7xl font-bold text-blue-600 mb-4 tabular-nums">
                        {count}
                    </div>
                    <div className={`text-sm font-medium ${count > 0 ? 'text-green-600' : count < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                        {count > 0 && '↑ Positive'}
                        {count < 0 && '↓ Negative'}
                        {count === 0 && '━ Zero'}
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                    {/* Step Control */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Step Size: {step}
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={step}
                            onChange={(e) => setStep(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>1</span>
                            <span>10</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-4">
                        <button
                            onClick={decrement}
                            className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                        >
                            - {step}
                        </button>
                        <button
                            onClick={reset}
                            className="py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Reset
                        </button>
                        <button
                            onClick={increment}
                            className="py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                        >
                            + {step}
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-4 border-t border-gray-200">
                        <div className="text-sm font-medium text-gray-700 mb-3">Quick Actions</div>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => setCount(0)}
                                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                            >
                                Set to 0
                            </button>
                            <button
                                onClick={() => setCount(100)}
                                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                            >
                                Set to 100
                            </button>
                            <button
                                onClick={() => setCount(-100)}
                                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                            >
                                Set to -100
                            </button>
                            <button
                                onClick={() => setCount(count * 2)}
                                className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
                            >
                                Double
                            </button>
                            <button
                                onClick={() => setCount(Math.floor(count / 2))}
                                className="px-3 py-1 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md transition-colors"
                            >
                                Half
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{Math.abs(count)}</div>
                        <div className="text-xs text-gray-500">Absolute</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{count * count}</div>
                        <div className="text-xs text-gray-500">Squared</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{count % 2 === 0 ? 'Even' : 'Odd'}</div>
                        <div className="text-xs text-gray-500">Type</div>
                    </div>
                </div>
            </div>

            {/* Code Example */}
            <div className="bg-gray-900 rounded-xl p-6 mt-8 overflow-x-auto">
                <pre className="text-green-400 text-sm">
                    {`import { useState } from 'react';

const [count, setCount] = useState(0);
const [step, setStep] = useState(1);

const increment = () => setCount(c => c + step);
const decrement = () => setCount(c => c - step);
const reset = () => setCount(0);

// In your JSX:
<button onClick={increment}>+ {step}</button>
<div>{count}</div>
<button onClick={decrement}>- {step}</button>`}
                </pre>
            </div>
        </div>
    );
}
