import React from 'react';
import { Layout } from '../../components/Layout';
import { useFloatData } from '@float.js/core';
import { BookOpen, Users, Layers, RefreshCw, ExternalLink } from 'lucide-react';

export default function AdminDashboard() {
    const { data: articles } = useFloatData('/api/articles');
    const { data: authors } = useFloatData('/api/authors');
    const { data: categories } = useFloatData('/api/categories');

    const stats = [
        { label: 'Artículos', value: articles?.length || 0, icon: BookOpen, color: 'text-primary' },
        { label: 'Autores', value: authors?.length || 0, icon: Users, color: 'text-secondary' },
        { label: 'Categorías', value: categories?.length || 0, icon: Layers, color: 'text-accent' },
    ];

    return (
        <div className="p-8 bg-base-200 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-base-content tracking-tight">
                            Nexovisión <span className="text-primary">CMS</span>
                        </h1>
                        <p className="text-base-content/60 mt-2">Panel de Control y Gestión de Contenidos</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="btn btn-outline btn-primary">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Sincronizar Base de Datos
                        </button>
                        <a href="/keystatic" className="btn btn-primary">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Abrir Keystatic UI
                        </a>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <div key={i} className="card bg-base-100 shadow-xl border border-base-300">
                            <div className="card-body flex-row items-center gap-4">
                                <div className={`p-3 rounded-2xl bg-base-200 ${stat.color}`}>
                                    <stat.icon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-medium text-base-content/50 uppercase tracking-widest">{stat.label}</h2>
                                    <p className="text-3xl font-black">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h3 className="card-title mb-4">Actividad Reciente</h3>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>Título</th>
                                            <th>Estado</th>
                                            <th>Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {articles?.slice(0, 5).map((art: any) => (
                                            <tr key={art.id}>
                                                <td className="font-medium">{art.title}</td>
                                                <td>
                                                    <div className={`badge ${art.is_draft ? 'badge-warning' : 'badge-success'} badge-sm`}>
                                                        {art.is_draft ? 'Borrador' : 'Publicado'}
                                                    </div>
                                                </td>
                                                <td className="text-xs opacity-50">{new Date(art.published_time).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h3 className="card-title mb-4">Estado del Sistema</h3>
                            <ul className="steps steps-vertical">
                                <li className="step step-primary">Entorno Configurado</li>
                                <li className="step step-primary">Base de Datos SQLite Activa</li>
                                <li className="step step-primary">API Layer Verificada</li>
                                <li className="step">Sincronización Automática</li>
                            </ul>
                            <div className="alert alert-info mt-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span>La API sigue los estándares OpenAPI 3.0.</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
