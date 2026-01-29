'use client';

import { useState } from 'react';
import { useFloatData } from '@float.js/core';
// Heroicons removed for stability
function UserIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
    );
}

interface Author {
    id: string;
    slug: string;
    name: string;
    job?: string;
    avatar?: string;
    bio?: string;
}

export default function AuthorsPage() {
    const { data: authors, isLoading: loading } = useFloatData<Author[]>('/api/authors');

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Autores</h1>
                <p className="text-gray-600">Gestiona los autores de tu contenido</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(authors || []).map((author) => (
                    <div
                        key={author.id}
                        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-200"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            {author.avatar ? (
                                <img
                                    src={author.avatar}
                                    alt={author.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                                    <UserIcon className="h-8 w-8 text-primary-600" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate">{author.name}</h3>
                                {author.job && (
                                    <p className="text-sm text-gray-500 truncate">{author.job}</p>
                                )}
                            </div>
                        </div>

                        {author.bio && (
                            <p className="text-sm text-gray-600 line-clamp-3">{author.bio}</p>
                        )}
                    </div>
                ))}
            </div>

            {(authors || []).length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No hay autores registrados</p>
                </div>
            )}
        </div>
    );
}
