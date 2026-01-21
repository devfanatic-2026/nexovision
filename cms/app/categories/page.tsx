'use client';

import { useState, useEffect } from 'react';
import { FolderIcon } from '@heroicons/react/24/outline';

interface Category {
    id: string;
    slug: string;
    title: string;
    inspire?: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

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
                {categories.map((category) => (
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

            {categories.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No hay categorías registradas</p>
                </div>
            )}
        </div>
    );
}
