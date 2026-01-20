import React from 'react';
import { initializeDb } from '../src/lib/database.js';
import { ArticleRepository } from '../src/lib/repositories/article.repository.js';
import { Calendar, User, Tag, Eye, EyeOff, Star, LayoutGrid, Clock, ChevronRight } from 'lucide-react';

async function fetchArticles() {
  const db = await initializeDb();
  const repo = new ArticleRepository(db);
  return await repo.findAllWithRelations();
}

export default async function HomePage() {
  const articles = await fetchArticles();

  return (
    <div className="min-h-screen bg-chile-paper text-chile-ink font-sans selection:bg-chile-blue/10">
      {/* Header */}
      <header className="max-w-5xl mx-auto pt-20 pb-12 px-6">
        <div className="flex justify-between items-end border-b border-editorial-200 pb-8">
          <div>
            <h1 className="text-display-sm text-chile-blue mb-2 font-display italic">Nexovisión</h1>
            <p className="text-xs uppercase tracking-widest text-editorial-500 font-bold">Content Management System</p>
          </div>
          <div className="flex gap-6">
            <a href="/admin/articles" className="text-xs uppercase tracking-widest font-bold hover:text-chile-red transition-colors">Artículos</a>
            <a href="/admin/categories" className="text-xs uppercase tracking-widest font-bold hover:text-chile-red transition-colors">Categorías</a>
            <a href="/admin/authors" className="text-xs uppercase tracking-widest font-bold hover:text-chile-red transition-colors">Autores</a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-24">
        {/* Actions bar */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2 text-editorial-400">
            <Clock className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest font-bold">{articles.length} Artículos en total</span>
          </div>
          <button
            id="sync-btn"
            className="btn btn-primary btn-sm rounded-none px-8 font-black tracking-widest uppercase h-12"
          >
            Sincronizar
          </button>
        </div>

        {/* Article Grid / List */}
        <div className="space-y-12">
          {articles.map((article) => (
            <div key={article.id} className="group relative border-b border-editorial-100 pb-12 last:border-0">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                {/* Image */}
                <div className="md:col-span-4 lg:col-span-3">
                  <div className="aspect-[4/3] bg-editorial-100 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 shadow-editorial">
                    {article.cover ? (
                      <img
                        src={article.cover}
                        alt={article.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-editorial-300">
                        <LayoutGrid className="w-8 h-8 opacity-20" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-8 lg:col-span-9 flex flex-col h-full">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.is_draft === 1 && (
                      <span className="badge badge-warning badge-outline rounded-none text-[10px] font-black uppercase tracking-tighter">
                        <EyeOff className="w-3 h-3 mr-1" /> Borrador
                      </span>
                    )}
                    {article.is_main_headline === 1 && (
                      <span className="badge badge-error rounded-none text-[10px] font-black uppercase tracking-tighter text-white">
                        <Star className="w-3 h-3 mr-1 fill-current" /> Titular Principal
                      </span>
                    )}
                    {article.is_sub_headline === 1 && (
                      <span className="badge badge-info rounded-none text-[10px] font-black uppercase tracking-tighter text-white">
                        Subtitular
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-black text-chile-ink leading-tight mb-3 group-hover:text-chile-red transition-colors font-serif">
                    {article.title}
                  </h2>

                  <p className="text-editorial-600 text-sm leading-relaxed mb-6 line-clamp-2 font-medium">
                    {article.description}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-wider font-bold text-editorial-400">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>{article.author_names || 'Admin'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span className="text-chile-blue">{article.category_title || 'General'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(article.published_time).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

              </div>

              <a
                href={`/admin/editor/${article.slug}`}
                className="absolute inset-0 z-0"
                aria-label={`Editar ${article.title}`}
              ></a>
            </div>
          ))}
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-editorial-100 text-[10px] uppercase tracking-widest text-editorial-400 font-bold flex justify-between">
        <div>Nexovisión CMS v2.0</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-chile-ink transition-colors">Documentación</a>
          <a href="#" className="hover:text-chile-ink transition-colors">Soporte</a>
        </div>
      </footer>

      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const syncButton = document.getElementById('sync-btn');
            if (syncButton) {
              syncButton.addEventListener('click', async function() {
                const button = this;
                const originalText = button.textContent;
                button.textContent = 'Sincronizando...';
                button.disabled = true;

                try {
                  const response = await fetch('/api/sync-action', {
                    method: 'POST'
                  });

                  const result = await response.json();

                  if (result.success) {
                    alert('Sincronización completada exitosamente');
                    window.location.reload();
                  } else {
                    alert('Error en la sincronización: ' + result.message);
                  }
                } catch (error) {
                  alert('Error de conexión: ' + error.message);
                } finally {
                  button.textContent = originalText;
                  button.disabled = false;
                }
              });
            }
          });
        `
      }} />
    </div>
  );
}