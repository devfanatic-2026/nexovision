import {
  PencilIcon,
  CalendarIcon,
  UserIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { initializeDb } from '../src/lib/database';
import { ArticleRepository } from '../src/lib/repositories/article.repository';

// Server Component (no 'use client')
export default async function DashboardPage() {
  // Initialize DB and Repository
  const db = await initializeDb();
  const articleRepo = new ArticleRepository(db);

  // Fetch data directly
  const articles = await articleRepo.findAllWithRelations();

  // Calculate stats
  const stats = {
    total: articles.length,
    published: articles.filter(a => a.is_draft === 0).length,
    drafts: articles.filter(a => a.is_draft === 1).length,
    mainHeadlines: articles.filter(a => a.is_main_headline === 1).length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Gestiona tus artículos, autores y categorías (SSR)</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Artículos</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Publicados</p>
              <p className="text-3xl font-bold text-green-600">{stats.published}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Borradores</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.drafts}</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1-4L14 8m-2-2l4-4m0 0l4 4m-4-4v10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Titulares</p>
              <p className="text-3xl font-bold text-purple-600">{stats.mainHeadlines}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Últimos Artículos</h2>
        <a href="/articles/new/edit">
          <Button variant="primary">
            <PencilIcon className="h-4 w-4 mr-2" />
            Nuevo Artículo
          </Button>
        </a>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {articles.slice(0, 10).map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-200"
          >
            <div className="flex gap-6">
              {article.cover && (
                <div className="flex-shrink-0">
                  <img
                    src={article.cover}
                    alt={article.title}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {article.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      {article.category_title && (
                        <span className="flex items-center gap-1">
                          <FolderIcon className="h-4 w-4" />
                          {article.category_title}
                        </span>
                      )}
                      {article.author_names && (
                        <span className="flex items-center gap-1">
                          <UserIcon className="h-4 w-4" />
                          {article.author_names}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(article.published_time).toLocaleDateString('es-ES')}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-3">
                      {article.is_draft === 1 && (
                        <span className="badge badge-warning">Borrador</span>
                      )}
                      {article.is_main_headline === 1 && (
                        <span className="badge badge-primary">Titular Principal</span>
                      )}
                      {article.is_sub_headline === 1 && (
                        <span className="badge badge-neutral">Sub-titular</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <a href={`/articles/${article.slug}/edit`}>
                      <Button variant="secondary" size="sm">
                        <PencilIcon className="h-4 w-4" />
                        Editar
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay artículos para mostrar</p>
            <a href="/articles/new/edit" className="mt-4 inline-block">
              <Button variant="primary">
                Crear tu primer artículo
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}