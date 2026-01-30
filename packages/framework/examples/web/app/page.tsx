/**
 * Main Menu - Float.js Showcase
 * Interactive menu showcasing 25+ examples
 */

'use client';

import { useState } from 'react';

interface Example {
    id: string;
    title: string;
    description: string;
    category: string;
    path: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const examples: Example[] = [
    // Forms (5 examples)
    { id: '1', title: 'Basic Login Form', description: 'Simple login form with validation', category: 'Forms', path: '/forms/login', difficulty: 'beginner' },
    { id: '2', title: 'Form Validation', description: 'Advanced validation with error messages', category: 'Forms', path: '/forms/validation', difficulty: 'intermediate' },
    { id: '3', title: 'Multi-Step Wizard', description: 'Multi-step form with progress tracker', category: 'Forms', path: '/forms/wizard', difficulty: 'intermediate' },
    { id: '4', title: 'File Upload', description: 'Image upload with preview', category: 'Forms', path: '/forms/upload', difficulty: 'intermediate' },
    { id: '5', title: 'Dynamic Fields', description: 'Add/remove fields dynamically', category: 'Forms', path: '/forms/dynamic', difficulty: 'advanced' },

    // Images (3 examples)
    { id: '6', title: 'Image Optimization', description: 'Responsive images with srcset', category: 'Images', path: '/images/optimization', difficulty: 'beginner' },
    { id: '7', title: 'Image Gallery', description: 'Grid gallery with lightbox', category: 'Images', path: '/images/gallery', difficulty: 'intermediate' },
    { id: '8', title: 'Avatar Upload', description: 'Profile picture with crop', category: 'Images', path: '/images/avatar', difficulty: 'advanced' },

    // State Management (4 examples)
    { id: '9', title: 'Simple Counter', description: 'Basic counter with useState', category: 'State', path: '/state/counter', difficulty: 'beginner' },
    { id: '10', title: 'Global Store', description: 'createFloatStore with persistence', category: 'State', path: '/state/store', difficulty: 'intermediate' },
    { id: '11', title: 'Undo/Redo', description: 'Time-travel with middleware', category: 'State', path: '/state/undo', difficulty: 'advanced' },
    { id: '12', title: 'Combined Stores', description: 'Multiple stores composed', category: 'State', path: '/state/combined', difficulty: 'advanced' },

    // Real-Time (3 examples)
    { id: '13', title: 'Chat Room', description: 'WebSocket chat application', category: 'Real-Time', path: '/realtime/chat', difficulty: 'intermediate' },
    { id: '14', title: 'Live Counter', description: 'Shared counter across clients', category: 'Real-Time', path: '/realtime/counter', difficulty: 'intermediate' },
    { id: '15', title: 'Presence Tracking', description: "Who's online tracking", category: 'Real-Time', path: '/realtime/presence', difficulty: 'advanced' },

    // AI Integration (2 examples)
    { id: '16', title: 'AI Chat', description: 'Streaming AI responses', category: 'AI', path: 'ai/chat', difficulty: 'intermediate' },
    { id: '17', title: 'Content Analysis', description: 'AI-powered content suggestions', category: 'AI', path: '/ai/analysis', difficulty: 'advanced' },

    // Routing (3 examples)
    { id: '18', title: 'Dynamic Routes', description: 'Blog posts with [slug]', category: 'Routing', path: '/routing/blog', difficulty: 'beginner' },
    { id: '19', title: 'Nested Routes', description: 'Dashboard with sub-routes', category: 'Routing', path: '/routing/dashboard', difficulty: 'intermediate' },
    { id: '20', title: 'Navigation', description: 'Programmatic navigation', category: 'Routing', path: '/routing/navigation', difficulty: 'beginner' },

    // Data & API (3 examples)
    { id: '21', title: 'Data Fetching', description: 'useFloatData hook examples', category: 'Data', path: '/data/fetch', difficulty: 'beginner' },
    { id: '22', title: 'API Routes', description: 'Type-safe API endpoints', category: 'Data', path: '/data/api', difficulty: 'intermediate' },
    { id: '23', title: 'Pagination', description: 'Infinite scroll implementation', category: 'Data', path: '/data/pagination', difficulty: 'intermediate' },

    // Advanced (3+ examples)
    { id: '24', title: 'Offline Mode', description: 'Work without network connection', category: 'Advanced', path: '/advanced/offline', difficulty: 'advanced' },
    { id: '25', title: 'Dark Mode', description: 'Theme switcher implementation', category: 'Advanced', path: '/advanced/theme', difficulty: 'beginner' },
    { id: '26', title: 'Animations', description: 'Smooth transitions and effects', category: 'Advanced', path: '/advanced/animations', difficulty: 'intermediate' },
];

const categories = Array.from(new Set(examples.map(e => e.category)));

const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
};

export default function HomePage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredExamples = examples.filter(example => {
        const matchesCategory = selectedCategory === 'all' || example.category === selectedCategory;
        const matchesSearch = example.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            example.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <h1 className="text-4xl font-bold mb-4">Float.js Web Showcase</h1>
                <p className="text-xl text-blue-100 mb-6">
                    Explore 25+ production-ready examples demonstrating Float.js framework capabilities
                </p>
                <div className="flex flex-wrap gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                        <div className="text-sm text-blue-100">Examples</div>
                        <div className="text-2xl font-bold">{examples.length}</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                        <div className="text-sm text-blue-100">Categories</div>
                        <div className="text-2xl font-bold">{categories.length}</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                        <div className="text-sm text-blue-100">Framework</div>
                        <div className="text-2xl font-bold">@float.js/core</div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search examples..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All
                        </button>
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === category
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Examples Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExamples.map(example => (
                    <a
                        key={example.id}
                        href={example.path}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 hover:border-blue-300 group"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <span className="text-sm font-medium text-gray-500">{example.category}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[example.difficulty]}`}>
                                {example.difficulty}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {example.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                            {example.description}
                        </p>
                        <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                            View Example
                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </a>
                ))}
            </div>

            {/* No Results */}
            {filteredExamples.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No examples found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter</p>
                </div>
            )}

            {/* Footer Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <div className="text-3xl font-bold text-blue-600">{examples.filter(e => e.difficulty === 'beginner').length}</div>
                        <div className="text-sm text-gray-600">Beginner</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-yellow-600">{examples.filter(e => e.difficulty === 'intermediate').length}</div>
                        <div className="text-sm text-gray-600">Intermediate</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-red-600">{examples.filter(e => e.difficulty === 'advanced').length}</div>
                        <div className="text-sm text-gray-600">Advanced</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-purple-600">{categories.length}</div>
                        <div className="text-sm text-gray-600">Categories</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
