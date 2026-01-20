import React from 'react';
import { Home, BookOpen, Users, Layers, Settings, LogOut, Terminal } from 'lucide-react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center justify-center">
                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden mb-4">
                    Open drawer
                </label>
                <main className="w-full min-h-screen">
                    {children}
                </main>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content border-r border-base-300">
                    {/* Sidebar content here */}
                    <li className="mb-8 px-4 py-2">
                        <h2 className="text-2xl font-black italic tracking-tighter text-primary">NEXOVISION</h2>
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">Intelligence CMS</p>
                    </li>

                    <li className="menu-title">Gestión</li>
                    <li><a href="/admin" className="active"><Home className="w-4 h-4" /> Dashboard</a></li>
                    <li><a href="/admin/articles"><BookOpen className="w-4 h-4" /> Artículos</a></li>
                    <li><a href="/admin/authors"><Users className="w-4 h-4" /> Autores</a></li>
                    <li><a href="/admin/categories"><Layers className="w-4 h-4" /> Categorías</a></li>

                    <li className="mt-4 menu-title">Sistema</li>
                    <li><a href="/api/docs"><Terminal className="w-4 h-4" /> API Docs (Swagger)</a></li>
                    <li><a href="/admin/settings"><Settings className="w-4 h-4" /> Configuración</a></li>

                    <div className="flex-grow"></div>

                    <div className="divider opacity-10"></div>
                    <li>
                        <button className="text-error">
                            <LogOut className="w-4 h-4" /> Cerrar Sesión
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};
