import React from 'react';
import { Layout } from '../../../components/Layout';
import { useFloatData } from '@float.js/core';
import { Plus, Edit2, Trash2, User } from 'lucide-react';

export default function AuthorsPage() {
    const { data: authors, loading } = useFloatData('/api/authors');

    return (
        <Layout>
            <div className="p-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-black mb-2">Autores</h1>
                        <div className="text-sm breadcrumbs opacity-50">
                            <ul>
                                <li><a href="/admin">Dashboard</a></li>
                                <li>Autores</li>
                            </ul>
                        </div>
                    </div>
                    <button className="btn btn-primary">
                        <Plus className="w-4 h-4 mr-2" /> Nuevo Autor
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading && (
                        <div className="col-span-full flex justify-center py-20">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                        </div>
                    )}

                    {authors?.map((author: any) => (
                        <div key={author.id} className="card bg-base-100 shadow-xl border border-base-300 hover:border-primary transition-colors">
                            <div className="card-body">
                                <div className="flex items-center gap-4">
                                    <div className="avatar">
                                        <div className="mask mask-circle w-16 h-16 bg-base-200">
                                            {author.avatar ? <img src={author.avatar} alt={author.name} /> : <User className="w-8 h-8 m-4 opacity-20" />}
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="card-title">{author.name}</h2>
                                        <p className="text-xs text-primary font-bold uppercase">{author.job}</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-sm opacity-70 line-clamp-2">{author.bio}</p>
                                <div className="card-actions justify-end mt-4">
                                    <button className="btn btn-ghost btn-sm btn-square"><Edit2 className="w-4 h-4" /></button>
                                    <button className="btn btn-ghost btn-sm btn-square text-error"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {!loading && authors?.length === 0 && (
                        <div className="col-span-full text-center py-12 opacity-50 italic">
                            No se encontraron autores.
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
