/**
 * Dynamic Routes Example (Blog)
 * Demonstrates route parameters and dynamic content rendering
 */

'use client';

import { useState } from 'react';
import { db } from '../../../data/database';

// Simulate a dynamic page component that typically receives params
function BlogPost({ slug, onBack }: { slug: string; onBack: () => void }) {
    const post = db.articles.findBySlug(slug);

    if (!post) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Post not found</h2>
                <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">Back to Blog</button>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={onBack}
                className="mb-6 flex items-center text-gray-500 hover:text-gray-900 transition-colors"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Articles
            </button>

            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8 shadow-lg">
                <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-8">
                    <div className="text-white">
                        <div className="flex gap-2 mb-3">
                            <span className="px-3 py-1 bg-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">{post.category}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-2">{post.title}</h1>
                        <div className="flex items-center gap-4 text-sm opacity-90">
                            <span>Published {post.publishedAt}</span>
                            <span>•</span>
                            <span>{post.views} views</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto">
                <div className="prose prose-lg prose-blue">
                    <p className="lead text-xl text-gray-600 font-medium mb-6">
                        {post.excerpt}
                    </p>
                    <div className="text-gray-800 leading-relaxed space-y-4">
                        {/* Simulate markdown rendering */}
                        {post.content.split('\n\n').map((paragraph, idx) => (
                            <p key={idx}>{paragraph}</p>
                        ))}
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <p>
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex gap-2">
                        {post.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BlogPage() {
    const [currentSlug, setCurrentSlug] = useState<string | null>(null);
    const articles = db.articles.findAll();

    // In a real app, this would be handled by the router matching /blog/[slug]
    if (currentSlug) {
        return <BlogPost slug={currentSlug} onBack={() => setCurrentSlug(null)} />;
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <a href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Examples
                </a>
                <h1 className="text-3xl font-bold text-gray-900">Dynamic Routes</h1>
                <p className="text-gray-600 mt-2">Example of blog structure with dynamic slugs `[slug]`</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                    <div
                        key={article.id}
                        onClick={() => setCurrentSlug(article.slug)}
                        className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow border border-gray-100"
                    >
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src={article.coverImage}
                                alt={article.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur text-blue-800 text-xs font-bold rounded-full shadow-sm">
                                    {article.category}
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {article.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {article.excerpt}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                                <span>{article.publishedAt}</span>
                                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-blue-500 font-medium">
                                    Read Article
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
