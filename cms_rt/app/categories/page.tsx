'use client';

import { useState } from 'react';
import { useFloatData } from '@float.js/core';

interface Category {
    id: string;
    slug: string;
    title: string;
    inspire?: string;
}

// Heroicons removed for stability
function FolderIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
    );
}

export default function CategoriesPage() {
    const { data: categories, isLoading: loading } = useFloatData<Category[]>('/api/categories');

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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Categorías</h1>
                <p className="text-gray-600">Organiza tu contenido por categorías</p>
            </div>

            <div className="space-y-4 max-w-3xl">
                {(categories || []).map((category) => (
                    <div
                        key={category.id}
                        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-200"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FolderIcon className="h-6 w-6 text-primary-600" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                                <p className="text-sm text-gray-500">{category.slug}</p>
                                {category.inspire && (
                                    <p className="text-sm text-gray-600 italic mt-1">&ldquo;{category.inspire}&rdquo;</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {(categories || []).length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No hay categorías registradas</p>
                </div>
            )}
        </div>
    );
}
