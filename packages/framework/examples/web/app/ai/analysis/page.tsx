/**
 * AI Content Analysis Example
 * Demonstrates analyzing text content using AI
 */

'use client';

import { useState } from 'react';

interface AnalysisResult {
    sentiment: 'positive' | 'neutral' | 'negative';
    keywords: string[];
    summary: string;
    score: number;
}

export default function AIAnalysisPage() {
    const [text, setText] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const analyzeText = async () => {
        if (!text.trim()) return;
        setAnalyzing(true);
        setResult(null);

        // Simulate API call to AI service
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simple mock logic for demonstration
        const isPositive = text.toLowerCase().includes('good') || text.toLowerCase().includes('great') || text.toLowerCase().includes('excellent');
        const isNegative = text.toLowerCase().includes('bad') || text.toLowerCase().includes('terrible') || text.toLowerCase().includes('poor');

        setResult({
            sentiment: isPositive ? 'positive' : isNegative ? 'negative' : 'neutral',
            keywords: text.split(' ').filter(w => w.length > 5).slice(0, 5),
            summary: text.length > 50 ? text.substring(0, 50) + '...' : text,
            score: isPositive ? 0.9 : isNegative ? 0.2 : 0.5
        });
        setAnalyzing(false);
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
                <h1 className="text-3xl font-bold text-gray-900">AI Content Analysis</h1>
                <p className="text-gray-600 mt-2">Analyze sentiment, extract keywords, and summarize text</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Area */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Content to Analyze</label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Paste your article, review, or comment here..."
                            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-shadow"
                        />
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-xs text-gray-500">{text.length} characters</span>
                            <button
                                onClick={analyzeText}
                                disabled={!text.trim() || analyzing}
                                className={`px-6 py-2 rounded-lg font-medium text-white transition-all ${analyzing || !text.trim()
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:from-blue-700 hover:to-purple-700'
                                    }`}
                            >
                                {analyzing ? 'Analyzing...' : 'Analyze Text'}
                            </button>
                        </div>
                    </div>

                    {/* Quick Samples */}
                    <div className="flex gap-2 text-sm flex-wrap">
                        <button onClick={() => setText("Float.js is an incredible framework! It makes development so fast and easy. I love the real-time features.")} className="px-3 py-1 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition">
                            Sample Positive
                        </button>
                        <button onClick={() => setText("The application crashed three times today. Testing was difficult and documentation is missing.")} className="px-3 py-1 bg-red-50 text-red-700 rounded-full hover:bg-red-100 transition">
                            Sample Negative
                        </button>
                    </div>
                </div>

                {/* Results Area */}
                <div>
                    {analyzing ? (
                        <div className="bg-white rounded-xl shadow-lg h-64 md:h-full flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                            <h3 className="text-lg font-bold text-gray-900">Processing...</h3>
                            <p className="text-gray-500 text-sm">Our AI models are analyzing your text</p>
                        </div>
                    ) : result ? (
                        <div className="bg-white rounded-xl shadow-lg h-full overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className={`p-6 text-white ${result.sentiment === 'positive' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                                    result.sentiment === 'negative' ? 'bg-gradient-to-br from-red-500 to-rose-600' :
                                        'bg-gradient-to-br from-gray-500 to-gray-600'
                                }`}>
                                <h2 className="text-2xl font-bold mb-1 capitalize">{result.sentiment} Sentiment</h2>
                                <p className="opacity-90">Confidence Score: {Math.round(result.score * 100)}%</p>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Key Topics</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.keywords.map((keyword, i) => (
                                            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                                #{keyword}
                                            </span>
                                        ))}
                                        {result.keywords.length === 0 && <span className="text-gray-400 italic">No keywords found</span>}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Automated Summary</h3>
                                    <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        {result.summary}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 h-64 md:h-full flex flex-col items-center justify-center text-center p-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No analysis yet</h3>
                            <p className="text-gray-500 max-w-xs mt-1">Enter text on the left and click analyze to see AI insights.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
