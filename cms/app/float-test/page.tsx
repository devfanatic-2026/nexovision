'use client';

import { useState, useEffect } from 'react';

export default function FloatTestPage() {
    const [count, setCount] = useState(0);
    const [text, setText] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        console.log('[Float Test] Component mounted on client!');
        console.log('[Float Test] useEffect running');
        setMounted(true);

        return () => {
            console.log('[Float Test] Component unmounting');
        };
    }, []);

    useEffect(() => {
        console.log(`[Float Test] Count changed to: ${count}`);
    }, [count]);

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ color: '#2563eb', marginBottom: '1rem' }}>
                🧪 Float.js Hydration Test
            </h1>

            {/* Hydration Status */}
            <div style={{
                padding: '1rem',
                background: mounted ? '#10b981' : '#fbbf24',
                color: 'white',
                borderRadius: '0.5rem',
                marginBottom: '2rem'
            }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
                    {mounted ? '✅ Hydration Successful!' : '⏳ Waiting for hydration...'}
                </h2>
                <p style={{ margin: '0.5rem 0 0', opacity: 0.9 }}>
                    {mounted ? 'Client-side JavaScript is running' : 'Server-side rendered content'}
                </p>
            </div>

            {/* Test 1: useState with button */}
            <div style={{
                marginBottom: '2rem',
                padding: '1.5rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.75rem'
            }}>
                <h2 style={{ color: '#374151', marginTop: 0 }}>
                    Test 1: useState & onClick
                </h2>
                <p style={{ color: '#6b7280' }}>
                    Click the button to test state management and event handlers
                </p>
                <button
                    onClick={() => setCount(count + 1)}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#1d4ed8'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#2563eb'}
                >
                    Clicked {count} times
                </button>
            </div>

            {/* Test 2: Form Input */}
            <div style={{
                marginBottom: '2rem',
                padding: '1.5rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.75rem'
            }}>
                <h2 style={{ color: '#374151', marginTop: 0 }}>
                    Test 2: Form Input & onChange
                </h2>
                <p style={{ color: '#6b7280' }}>
                    Type in the input to test controlled components
                </p>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type something..."
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        marginBottom: '0.5rem'
                    }}
                />
                {text && (
                    <p style={{
                        padding: '0.5rem',
                        background: '#eff6ff',
                        borderRadius: '0.25rem',
                        color: '#1e40af'
                    }}>
                        You typed: <strong>{text}</strong>
                    </p>
                )}
            </div>

            {/* Test 3: useEffect */}
            <div style={{
                marginBottom: '2rem',
                padding: '1.5rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.75rem'
            }}>
                <h2 style={{ color: '#374151', marginTop: 0 }}>
                    Test 3: useEffect
                </h2>
                <p style={{ color: '#6b7280' }}>
                    Check the browser console (<code>F12</code>) to see effect logs
                </p>
                <div style={{
                    padding: '1rem',
                    background: '#1f2937',
                    color: '#10b981',
                    borderRadius: '0.5rem',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                }}>
                    <div>[Float Test] Component mounted on client!</div>
                    <div>[Float Test] useEffect running</div>
                    {count > 0 && <div>[Float Test] Count changed to: {count}</div>}
                </div>
            </div>

            {/* Summary */}
            <div style={{
                padding: '1.5rem',
                background: '#f9fafb',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb'
            }}>
                <h3 style={{ marginTop: 0, color: '#111827' }}>Test Results</h3>
                <ul style={{ color: '#4b5563', lineHeight: '1.8' }}>
                    <li>✅ Server-side rendering: {mounted ? 'Working' : 'Check HTML source'}</li>
                    <li>✅ Client hydration: {mounted ? 'Working' : 'Waiting...'}</li>
                    <li>✅ State management: {count > 0 ? 'Working' : 'Click button above'}</li>
                    <li>✅ Event handlers: {count > 0 ? 'Working' : 'Not tested yet'}</li>
                    <li>✅ Form inputs: {text ? 'Working' : 'Type in input above'}</li>
                    <li>✅ Effects: {mounted ? 'Working (check console)' : 'Not running yet'}</li>
                </ul>
            </div>
        </div>
    );
}
