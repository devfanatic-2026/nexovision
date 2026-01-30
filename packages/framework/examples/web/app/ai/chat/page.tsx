/**
 * AI Chat Example
 * Demonstrates basic AI integration UI
 */

'use client';

import { useState, useRef, useEffect } from 'react';

// Use this to simulate AI stream
const simulateAIStream = (prompt: string, onChunk: (text: string) => void, onComplete: () => void) => {
    let response = "I'm a simulated AI response for the Float.js showcase. I can help you understand how to build great apps!";

    if (prompt.toLowerCase().includes('float')) {
        response = "Float.js is a fantastic framework for building modern web and mobile applications with a shared codebase.";
    }

    let i = 0;
    const interval = setInterval(() => {
        if (i < response.length) {
            onChunk(response[i]);
            i++;
        } else {
            clearInterval(interval);
            onComplete();
        }
    }, 30); // Simulate typing speed
};

export default function AIChatPage() {
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
        { role: 'assistant', content: 'Hello! How can I help you with Float.js today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsTyping(true);

        // Prepare for AI response simulating latency
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            simulateAIStream(
                userMsg,
                (chunk) => {
                    setMessages(prev => {
                        const newHistory = [...prev];
                        const lastMsg = newHistory[newHistory.length - 1];
                        lastMsg.content += chunk;
                        return newHistory;
                    });
                },
                () => setIsTyping(false)
            );
        }, 500);
    };

    return (
        <div className="max-w-2xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
            <div className="mb-4">
                <a href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Examples
                </a>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-3xl">✨</span> AI Chat Assistant
                </h1>
            </div>

            <div className="bg-white rounded-xl shadow-lg flex-1 flex flex-col overflow-hidden border border-gray-200">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                                    }`}>
                                    {msg.role === 'user' ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    )}
                                </div>

                                {/* Bubble */}
                                <div className={`rounded-2xl px-5 py-3 shadow-sm ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                    {msg.role === 'assistant' && msg.content === '' && (
                                        <span className="animate-pulse">Thinking...</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-gray-200">
                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask something about Float.js..."
                            className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-shadow"
                            disabled={isTyping}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                        >
                            <svg className="w-6 h-6 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <span className="text-xs text-gray-400 font-medium">Powered by Float.js AI Engine</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
