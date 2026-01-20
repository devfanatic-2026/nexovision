import React from 'react';
import { Layout } from '../../../components/Layout';
import { useFloatData } from '@float.js/core';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

export default function ArticlesPage() {
    const { data: articles, loading, error } = useFloatData('/api/articles');

    return (
        <Layout>
            <div className="p-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-black mb-2">Artículos</h1>
                        <div className="text-sm breadcrumbs opacity-50">
                            <ul>
                                <li><a href="/admin">Dashboard</a></li>
                                <li>Artículos</li>
                            </ul>
                        </div>
                    </div>
                    <button className="btn btn-primary">
                        <Plus className="w-4 h-4 mr-2" /> Nuevo Artículo
                    </button>
                </div>

                <div className="card bg-base-100 shadow-xl border border-base-300">
                    <div className="p-4 border-b border-base-300 flex flex-wrap gap-4 items-center justify-between">
                        <div className="join">
                            <div className="relative join-item">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                                <input className="input input-bordered pl-10 w-64 join-item" placeholder="Buscar por título..." />
                            </div>
                            <button className="btn join-item"><Filter className="w-4 h-4 mr-2" /> Filtrar</button>
                        </div>
                        <div className="text-sm opacity-50">
                            Mostrando {articles?.length || 0} resultados
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table table-lg">
                            <thead>
                                <tr>
                                    <th className="w-16">Acciones</th>
                                    <th>Artículo</th>
                                    <th>Categoría</th>
                                    <th>Publicación</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12">
                                            <span className="loading loading-spinner loading-lg text-primary"></span>
                                        </td>
                                    </tr>
                                )}

                                {articles?.map((art: any) => (
                                    <tr key={art.id} className="hover">
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
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12 bg-base-200">
                                                        {art.cover ? <img src={art.cover} alt={art.title} /> : <BookOpen className="w-6 h-6 m-3 opacity-20" />}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{art.title}</div>
                                                    <div className="text-xs opacity-50 truncate w-64">{art.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="badge badge-ghost font-mono text-[10px] uppercase">{art.category_id || 'Sin Categoría'}</div>
                                        </td>
                                        <td>
                                            <div className="text-sm">{new Date(art.published_time).toLocaleDateString()}</div>
                                            <div className="text-[10px] opacity-30 uppercase font-bold">{new Date(art.published_time).toLocaleTimeString()}</div>
                                        </td>
                                        <td>
                                            {art.is_draft ? (
                                                <span className="badge badge-warning badge-sm">Borrador</span>
                                            ) : (
                                                <span className="badge badge-success badge-sm">Publicado</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {!loading && articles?.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12 opacity-50 italic">
                                            No se encontraron artículos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-base-300 flex justify-center">
                        <div className="join">
                            <button className="join-item btn btn-sm">1</button>
                            <button className="join-item btn btn-sm btn-disabled">...</button>
                            <button className="join-item btn btn-sm">9</button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
