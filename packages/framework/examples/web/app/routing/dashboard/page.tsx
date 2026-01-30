/**
 * Nested Routes Example (Dashboard)
 * Demonstrates layout inheritance and sub-navigation
 */

'use client';

import { useState } from 'react';

// Sub-components for different dashboard views
const Overview = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Total Revenue', 'Active Users', 'Sales'].map((metric, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">{metric}</h3>
                    <div className="flex items-end justify-between mt-2">
                        <span className="text-3xl font-bold text-gray-900">
                            {metric === 'Total Revenue' ? '$24,500' : metric === 'Active Users' ? '1,234' : '345'}
                        </span>
                        <span className="text-green-600 text-sm font-medium flex items-center">
                            +12.5%
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </span>
                    </div>
                </div>
            ))}
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-64 flex items-center justify-center text-gray-400">
            Chart Visualization Placeholder
        </div>
    </div>
);

const Settings = () => (
    <div className="max-w-2xl bg-white p-8 rounded-xl border border-gray-200 shadow-sm animate-in fade-in">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Account Settings</h2>
        <div className="space-y-6">
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                    <h3 className="font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive daily digest emails</p>
                </div>
                <div className="w-11 h-6 bg-blue-600 rounded-full cursor-pointer relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                    <h3 className="font-medium text-gray-900">Two-Factor Auth</h3>
                    <p className="text-sm text-gray-500">Add extra security to your account</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Enable</button>
            </div>
        </div>
    </div>
);

const Activity = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in">
        <div className="p-6 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">Recent Activity</h2>
        </div>
        <div>
            {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                        {item}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">New order received from Client X</p>
                        <p className="text-xs text-gray-500">{item} hours ago</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'activity'>('overview');

    return (
        <div className="max-w-6xl mx-auto h-[800px] flex overflow-hidden bg-gray-100 rounded-2xl shadow-2xl border border-gray-200">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-gray-900 text-white flex flex-col hidden md:flex">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-sm"></div>
                        Dashboard
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('activity')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'activity' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Activity
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Settings
                    </button>
                </nav>

                <div className="p-6 border-t border-gray-800">
                    <a href="/" className="text-gray-500 hover:text-white flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Exit Demo
                    </a>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Top Bar matching dashboard style */}
                <header className="bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h2>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full relative">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-8">
                    {activeTab === 'overview' && <Overview />}
                    {activeTab === 'settings' && <Settings />}
                    {activeTab === 'activity' && <Activity />}
                </main>
            </div>
        </div>
    );
}
