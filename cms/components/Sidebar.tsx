'use client';

import { clsx } from 'clsx';
import {
    NewspaperIcon,
    UserGroupIcon,
    FolderIcon,
    PlusIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Dashboard', href: '/', icon: ChartBarIcon },
    { name: 'Artículos', href: '/articles', icon: NewspaperIcon },
    { name: 'Autores', href: '/authors', icon: UserGroupIcon },
    { name: 'Categorías', href: '/categories', icon: FolderIcon },
];

export function Sidebar() {
    // Use native browser location for active state
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

    return (
        <div className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
            {/* Logo/Brand */}
            <div className="flex h-16 items-center border-b border-gray-200 px-6">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                    Nexovisión CMS
                </h1>
            </div>

            {/* New Article Button */}
            <div className="px-4 pt-6 pb-4">
                <a href="/articles/new/edit">
                    <button className="w-full flex items-center justify-center gap-2 bg-primary-500 text-white px-4 py-3 rounded-lg hover:bg-primary-600 transition-colors duration-200 font-medium shadow-sm hover:shadow-md">
                        <PlusIcon className="h-5 w-5" />
                        Nuevo Artículo
                    </button>
                </a>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                    return (
                        <a
                            key={item.name}
                            href={item.href}
                            className={clsx(
                                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            )}
                        >
                            <item.icon className={clsx('h-5 w-5', isActive ? 'text-primary-600' : 'text-gray-400')} />
                            {item.name}
                        </a>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4">
                <div className="text-xs text-gray-500 text-center">
                    v1.0.0 • Database-driven CMS
                </div>
            </div>
        </div>
    );
}
