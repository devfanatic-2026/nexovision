/**
 * API Routes Example
 * Demonstrates type-safe API interactions
 */

'use client';

import { useState } from 'react';

// Mock API Response Types
interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    status: number;
}

// Simulated API Client
const apiClient = {
    get: async<T>(endpoint: string): Promise<ApiResponse< T >> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock responses based on endpoint
    if (endpoint === '/api/status') {
        return { data: { status: 'healthy', uptime: '99.9%', version: '1.0.0' } as any, error: null, status: 200 };
    }
    if (endpoint === '/api/user') {
        // Simulate random auth error
        if (Math.random() > 0.7) {
            return { data: null, error: 'Unauthorized', status: 401 };
        }
        return { data: { id: 1, name: 'Admin User', role: 'admin' } as any, error: null, status: 200 };
    }

    return { data: null, error: 'Not Found', status: 404 };
},

post: async<T>(endpoint: string, body: any): Promise<ApiResponse<T>> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: { success: true, id: Date.now(), received: body } as any, error: null, status: 201 };
}
};

export default function ApiRoutesPage() {
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [endpoint, setEndpoint] = useState('');

    const testEndpoint = async (url: string, method: 'GET' | 'POST' = 'GET') => {
        setLoading(true);
        setEndpoint(`${method} ${url}`);
        setResponse(null);

        try {
            const res = method === 'GET'
                ? await apiClient.get(url)
                : await apiClient.post(url, { timestamp: Date.now(), source: 'web-client' });
            setResponse(res);
        } catch (e) {
            setResponse({ error: 'Network Error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <a href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Examples
                </a>
                <h1 className="text-3xl font-bold text-gray-900">API Routes</h1>
                <p className="text-gray-600 mt-2">Test type-safe API endpoints and handle responses</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4">Available Endpoints</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer" onClick={() => testEndpoint('/api/status')}>
                                <div className="flex items-center gap-3">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">GET</span>
                                    <code className="text-sm font-mono text-gray-600">/api/status</code>
                                </div>
                                <span className="text-blue-600 text-sm">Test &rarr;</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer" onClick={() => testEndpoint('/api/user')}>
                                <div className="flex items-center gap-3">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">GET</span>
                                    <code className="text-sm font-mono text-gray-600">/api/user</code>
                                </div>
                                <span className="text-blue-600 text-sm">Test &rarr;</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer" onClick={() => testEndpoint('/api/data', 'POST')}>
                                <div className="flex items-center gap-3">
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">POST</span>
                                    <code className="text-sm font-mono text-gray-600">/api/data</code>
                                </div>
                                <span className="text-blue-600 text-sm">Test &rarr;</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-2">How it works</h3>
                        <p className="text-sm text-blue-800 mb-4">
                            Float.js allows you to define API routes in `app/api` directory. These are automatically typed and can be consumed on the client.
                        </p>
                        <pre className="bg-blue-900 text-blue-50 p-4 rounded-lg text-xs overflow-x-auto">
                            {`// app/api/user.ts
export async function GET(req) {
  return Response.json({ 
    user: 'Admin' 
  });
}`}
                        </pre>
                    </div>
                </div>

                <div className="bg-gray-900 rounded-xl shadow-lg p-6 font-mono text-sm overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
                        <span className="text-gray-400">Response Console</span>
                        {endpoint && <span className="text-green-400 text-xs">{endpoint}</span>}
                    </div>

                    <div className="flex-1 min-h-[300px] overflow-auto">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <svg className="w-8 h-8 animate-spin mb-2" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing request...
                            </div>
                        ) : response ? (
                            <div className="space-y-2 animate-in fade-in">
                                <div className={`text-xs font-bold ${response.status >= 200 && response.status < 300 ? 'text-green-500' : 'text-red-500'}`}>
                                    HTTP {response.status}
                                </div>
                                <pre className="text-gray-300">
                                    {JSON.stringify(response, null, 2)}
                                </pre>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-600">
                                Select an endpoint to test
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
