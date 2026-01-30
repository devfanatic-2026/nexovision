/**
 * Real-Time Chat Example
 * Demonstrates WebSocket integration with Float.js
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { db } from '../../../data/database';

// Simulate a socket connection for the example
const useSocket = (url: string) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [status, setStatus] = useState<'connected' | 'disconnected'>('disconnected');

    // Simple mock simulation of socket events
    useEffect(() => {
        setStatus('connected');

        // Simulate incoming messages periodically
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                const randomMsg = {
                    id: Date.now(),
                    text: ['Hello!', 'How are you?', 'Float.js is cool!', 'Real-time update!'][Math.floor(Math.random() * 4)],
                    sender: 'System',
                    timestamp: new Date().toLocaleTimeString()
                };
                setMessages(prev => [...prev, randomMsg]);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const sendMessage = (text: string) => {
        const msg = {
            id: Date.now(),
            text,
            sender: 'You',
            timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, msg]);
    };

    return { messages, sendMessage, status };
};

export default function ChatPage() {
    const { messages, sendMessage, status } = useSocket('ws://localhost:3000');
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        sendMessage(inputText);
        setInputText('');
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
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Live Chat</h1>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        <span className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {status === 'connected' ? 'Connected' : 'Disconnected'}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg flex-1 flex flex-col overflow-hidden border border-gray-200">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-400 mt-20">
                            <p>No messages yet. Start chatting!</p>
                        </div>
                    )}
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.sender === 'You'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                                }`}>
                                <p>{msg.text}</p>
                            </div>
                            <span className="text-xs text-gray-400 mt-1 px-1">
                                {msg.sender} • {msg.timestamp}
                            </span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <form onSubmit={handleSend} className="flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim()}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${!inputText.trim()
                                    ? 'bg-gray-100 text-gray-400'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
