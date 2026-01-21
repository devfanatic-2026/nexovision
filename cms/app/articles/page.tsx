import {
    PencilIcon,
    CalendarIcon,
    UserIcon,
    FolderIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { initializeDb } from '../../src/lib/database';
import { ArticleRepository } from '../../src/lib/repositories/article.repository';

// Server Component
export default async function ArticlesPage() {
    const db = await initializeDb();
    const articleRepo = new ArticleRepository(db);
    const articles = await articleRepo.findAllWithRelations();

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Artículos</h1>
                    <p className="text-gray-600">Gestiona todo el contenido de tu sitio</p>
                </div>
                <a href="/articles/new/edit">
                    <Button variant="primary">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Nuevo Artículo
                    </Button>
                </a>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Título</th>
                                <th className="px-6 py-4">Autor</th>
                                <th className="px-6 py-4">Categoría</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {articles.map((article) => (
                                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="flex items-center gap-3">
                                            {article.cover && (
                                                <img
                                                    src={article.cover}
                                                    alt=""
                                                    className="h-10 w-14 object-cover rounded shadow-sm border border-gray-100"
                                                />
                                            )}
                                            <span className="line-clamp-1">{article.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <UserIcon className="h-4 w-4 text-gray-400" />
                                            {article.author_names || <span className="text-gray-400 italic">Sin autor</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {article.category_title ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {article.category_title}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 italic">Sin categoría</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1 flex-wrap">
                                            {article.is_draft === 1 ? (
                                                <span className="px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                    Borrador
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                    Publicado
                                                </span>
                                            )}

                                            {article.is_main_headline === 1 && (
                                                <span className="px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200" title="Titular Principal">
                                                    Principal
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                                            {new Date(article.published_time).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a href={`/articles/${article.slug}/edit`}>
                                            <Button variant="secondary" size="sm">
                                                <PencilIcon className="h-4 w-4" />
                                                <span className="hidden sm:inline ml-1">Editar</span>
                                            </Button>
                                        </a>
                                    </td>
                                </tr>
                            ))}

                            {articles.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <FolderIcon className="h-8 w-8 text-gray-300" />
                                            <p>No se encontraron artículos</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
