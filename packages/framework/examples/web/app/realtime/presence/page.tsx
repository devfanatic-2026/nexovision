/**
 * Presence Tracking Example
 * Demonstrates real-time user presence (who is online)
 */

'use client';

import { useState, useEffect } from 'react';
import { db } from '../../../data/database';

interface UserStatus {
    id: number;
    name: string;
    avatar: string;
    status: 'online' | 'idle' | 'offline';
    lastSeen: string;
}

export default function PresencePage() {
    const [users, setUsers] = useState<UserStatus[]>([]);
    const [currentUserStatus, setCurrentUserStatus] = useState<'online' | 'idle' | 'offline'>('online');

    // Simulate initial data fetch and real-time updates
    useEffect(() => {
        // Load mock users
        const mockData = db.users.findAll().map(u => ({
            id: u.id,
            name: u.name,
            avatar: u.avatar,
            status: u.status as 'online' | 'idle' | 'offline',
            lastSeen: new Date().toLocaleTimeString()
        }));
        setUsers(mockData);

        // Simulate random status changes
        const interval = setInterval(() => {
            setUsers(current =>
                current.map(user => {
                    if (Math.random() > 0.8 && user.id !== 1) { // Apply random changes to others
                        const statuses: ('online' | 'idle' | 'offline')[] = ['online', 'idle', 'offline'];
                        return {
                            ...user,
                            status: statuses[Math.floor(Math.random() * 3)],
                            lastSeen: new Date().toLocaleTimeString()
                        };
                    }
                    return user;
                })
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'bg-green-500';
            case 'idle': return 'bg-yellow-500';
            case 'offline': return 'bg-gray-400';
            default: return 'bg-gray-400';
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
                <h1 className="text-3xl font-bold text-gray-900">Presence Tracking</h1>
                <p className="text-gray-600 mt-2">See who is online in real-time</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Current User Control */}
                <div className="col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500 sticky top-4">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Your Status</h2>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative">
                                <img src={users[0]?.avatar || 'https://i.pravatar.cc/150?img=1'} alt="You" className="w-16 h-16 rounded-full" />
                                <div className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full ${getStatusColor(currentUserStatus)}`}></div>
                            </div>
                            <div>
                                <div className="font-bold text-lg">You</div>
                                <div className="text-gray-500 text-sm capitalize">{currentUserStatus}</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-2">Set Status</p>
                            <button
                                onClick={() => setCurrentUserStatus('online')}
                                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${currentUserStatus === 'online' ? 'bg-green-50 text-green-700 border border-green-200' : 'hover:bg-gray-50'}`}
                            >
                                <div className="w-3 h-3 rounded-full bg-green-500"></div> Online
                            </button>
                            <button
                                onClick={() => setCurrentUserStatus('idle')}
                                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${currentUserStatus === 'idle' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'hover:bg-gray-50'}`}
                            >
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div> Idle
                            </button>
                            <button
                                onClick={() => setCurrentUserStatus('offline')}
                                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${currentUserStatus === 'offline' ? 'bg-gray-100 text-gray-700 border border-gray-200' : 'hover:bg-gray-50'}`}
                            >
                                <div className="w-3 h-3 rounded-full bg-gray-400"></div> Invisible
                            </button>
                        </div>
                    </div>
                </div>

                {/* User List */}
                <div className="col-span-1 md:col-span-2">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Team Members</h2>
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                                {users.filter(u => u.status !== 'offline').length} Active
                            </span>
                        </div>

                        <div className="space-y-4">
                            {users.filter(u => u.id !== 1).map(user => (
                                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                                            <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${getStatusColor(user.status)}`}></div>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500 capitalize">{user.status}</div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                                        Last seen: {user.lastSeen}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
