import React from 'react';
import { Layout } from '../../../components/Layout';
import { useFloatData } from '@float.js/core';
import { Plus, Edit2, Trash2, Layers } from 'lucide-react';

export default function CategoriesPage() {
    const { data: categories, loading } = useFloatData('/api/categories');

    return (
        <Layout>
            <div className="p-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-black mb-2">Categorías</h1>
                        <div className="text-sm breadcrumbs opacity-50">
                            <ul>
                                <li><a href="/admin">Dashboard</a></li>
                                <li>Categorías</li>
                            </ul>
                        </div>
                    </div>
                    <button className="btn btn-primary">
                        <Plus className="w-4 h-4 mr-2" /> Nueva Categoría
                    </button>
                </div>

                <div className="card bg-base-100 shadow-xl border border-base-300">
                    <div className="overflow-x-auto">
                        <table className="table table-lg">
                            <thead>
                                <tr>
                                    <th className="w-16">Acciones</th>
                                    <th>Título</th>
                                    <th>Path / Slug</th>
                                    <th>Inspiración</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-12">
                                            <span className="loading loading-spinner loading-lg text-primary"></span>
                                        </td>
                                    </tr>
                                )}

                                {categories?.map((cat: any) => (
                                    <tr key={cat.id} className="hover">
                                        <td>
                                            <div className="flex gap-1">
                                                <button className="btn btn-square btn-sm btn-ghost hover:text-primary">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="btn btn-square btn-sm btn-ghost hover:text-error">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-base-200">
                                                    <Layers className="w-4 h-4 opacity-40" />
                                                </div>
                                                <div className="font-bold">{cat.title}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <code className="text-xs bg-base-200 px-2 py-1 rounded">/{cat.slug}</code>
                                        </td>
                                        <td>
                                            <p className="text-sm opacity-60 italic">"{cat.inspire || 'Sin frase definida'}"</p>
                                        </td>
                                    </tr>
                                ))}

                                {!loading && categories?.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-12 opacity-50 italic">
                                            No se encontraron categorías.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
