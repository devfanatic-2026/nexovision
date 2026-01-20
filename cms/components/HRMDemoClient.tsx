/*
 * Client Component for HMR Demo
 * 
 * This component uses Float.js framework hooks for client-side state management
 */

'use client';

import { useState, useEffect } from 'react';
import { useFloatStore, createFloatStore } from '@float.js/core';

// Define the application state structure
interface AppState {
  counter: number;
  timer: number;
  isTimerRunning: boolean;
  selectedAuthor: string | null;
  selectedArticle: string | null;
  articles: any[];
  authors: any[];
  filters: {
    status: 'all' | 'draft' | 'published';
    category: string | 'all';
  };
  logEntries: string[];
}

// Create the global store with initial state
const useHMRStore = createFloatStore<AppState>({
  counter: 0,
  timer: 0,
  isTimerRunning: false,
  selectedAuthor: null,
  selectedArticle: null,
  articles: [],
  authors: [],
  filters: {
    status: 'all',
    category: 'all'
  },
  logEntries: []
});

// Client component for HMR demo functionality
export default function HRMDemoClient({ initialArticles, initialAuthors }) {
  // Use the framework's store for state management
  const counter = useFloatStore(useHMRStore, state => state.counter);
  const timer = useFloatStore(useHMRStore, state => state.timer);
  const isTimerRunning = useFloatStore(useHMRStore, state => state.isTimerRunning);
  const selectedAuthor = useFloatStore(useHMRStore, state => state.selectedAuthor);
  const selectedArticle = useFloatStore(useHMRStore, state => state.selectedArticle);
  const articles = useFloatStore(useHMRStore, state => state.articles);
  const authors = useFloatStore(useHMRStore, state => state.authors);
  const filters = useFloatStore(useHMRStore, state => state.filters);
  const logEntries = useFloatStore(useHMRStore, state => state.logEntries);
  
  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Actions using the store's setState
  const incrementCounter = () => {
    useHMRStore.setState(prev => ({
      ...prev,
      counter: prev.counter + 1,
      logEntries: [`${new Date().toLocaleTimeString()}: Contador incrementado a ${prev.counter + 1}`, ...prev.logEntries.slice(0, 9)]
    }));
  };

  const toggleTimer = () => {
    useHMRStore.setState(prev => ({
      ...prev,
      isTimerRunning: !prev.isTimerRunning,
      logEntries: [`${new Date().toLocaleTimeString()}: Timer ${!prev.isTimerRunning ? 'iniciado' : 'detenido'}`, ...prev.logEntries.slice(0, 9)]
    }));
  };

  const resetTimer = () => {
    useHMRStore.setState(prev => ({
      ...prev,
      timer: 0,
      logEntries: [`${new Date().toLocaleTimeString()}: Timer reiniciado`, ...prev.logEntries.slice(0, 9)]
    }));
  };

  const selectAuthor = (authorId) => {
    useHMRStore.setState(prev => ({
      ...prev,
      selectedAuthor: authorId,
      logEntries: [`${new Date().toLocaleTimeString()}: Autor seleccionado ${authorId}`, ...prev.logEntries.slice(0, 9)]
    }));
  };

  const selectArticle = (articleId) => {
    useHMRStore.setState(prev => ({
      ...prev,
      selectedArticle: articleId,
      logEntries: [`${new Date().toLocaleTimeString()}: Artículo seleccionado ${articleId}`, ...prev.logEntries.slice(0, 9)]
    }));
  };

  const updateFilter = (filterName, value) => {
    useHMRStore.setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterName]: value
      },
      logEntries: [`${new Date().toLocaleTimeString()}: Filtro ${filterName} actualizado a ${value}`, ...prev.logEntries.slice(0, 9)]
    }));
  };

  // Timer effect
  useEffect(() => {
    let interval = null;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        useHMRStore.setState(prev => ({
          ...prev,
          timer: prev.timer + 1,
          logEntries: [`${new Date().toLocaleTimeString()}: Timer actualizado a ${Math.floor((prev.timer + 1) / 60)}:${(prev.timer + 1) % 60}`, ...prev.logEntries.slice(0, 9)]
        }));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Filter articles based on current filters
  const filteredArticles = articles.filter(article => {
    const matchesAuthor = !selectedAuthor || article.author_id === selectedAuthor;
    const matchesStatus = filters.status === 'all' || 
                         (filters.status === 'draft' && article.is_draft) || 
                         (filters.status === 'published' && !article.is_draft);
    return matchesAuthor && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Demo Avanzada de HMR</h1>
          <p className="text-lg text-gray-600">Gestión de estados con el potencial completo de Float.js</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <section className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Controles de HMR</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">Contador de HMR</h3>
                  <p className="text-gray-700 mb-2">Valor actual: <span className="font-bold text-blue-600">{counter}</span></p>
                  <button 
                    onClick={incrementCounter}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Incrementar
                  </button>
                  <p className="mt-2 text-sm text-gray-500">
                    Este valor se mantiene durante las actualizaciones de HMR
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">Temporizador Persistente</h3>
                  <p className="text-gray-700 mb-2">Tiempo: <span className="font-bold text-green-600">{formatTime(timer)}</span></p>
                  <div className="flex space-x-2">
                    <button 
                      onClick={toggleTimer}
                      className={`px-3 py-1 rounded ${
                        isTimerRunning 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {isTimerRunning ? 'Detener' : 'Iniciar'}
                    </button>
                    <button 
                      onClick={resetTimer}
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      Reiniciar
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    El temporizador continúa durante las actualizaciones de HMR
                  </p>
                </div>
              </div>
            </section>
            
            <section className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Filtros</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={filters.status}
                    onChange={(e) => updateFilter('status', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="all">Todos</option>
                    <option value="draft">Borradores</option>
                    <option value="published">Publicados</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    value={filters.category}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="all">Todas</option>
                    <option value="technology">Tecnología</option>
                    <option value="politics">Política</option>
                    <option value="economy">Economía</option>
                  </select>
                </div>
              </div>
            </section>
          </div>
          
          {/* Middle Column - Authors and Articles */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Autores</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {authors.map(author => (
                  <div
                    key={author.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedAuthor === author.id
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                    onClick={() => selectAuthor(author.id)}
                  >
                    <div className="font-medium text-gray-900">{author.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{author.bio}</div>
                  </div>
                ))}
              </div>
            </section>
            
            <section className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Artículos {selectedAuthor ? `de ${authors.find(a => a.id === selectedAuthor)?.name}` : ''}
              </h2>
              {filteredArticles.length === 0 ? (
                <p className="text-gray-500 italic">No hay artículos para mostrar</p>
              ) : (
                <div className="space-y-3">
                  {filteredArticles.map(article => (
                    <div
                      key={article.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedArticle === article.id
                          ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                          : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                      }`}
                      onClick={() => selectArticle(article.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">{article.title}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            Fecha: {new Date(article.published_time).toLocaleDateString()} | Categoría: {article.category_id}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          article.is_draft 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {article.is_draft ? 'Borrador' : 'Publicado'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
            
            {selectedArticle && (
              <section className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Editor de Artículo</h2>
                {(() => {
                  const article = articles.find(a => a.id === selectedArticle);
                  if (!article) return null;
                  
                  return (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input
                          type="text"
                          value={article.title}
                          readOnly
                          className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                        <select
                          value={article.category_id || ''}
                          disabled
                          className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                        >
                          <option value="">Sin categoría</option>
                          <option value="technology">Tecnología</option>
                          <option value="politics">Política</option>
                          <option value="economy">Economía</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Publicación</label>
                        <input
                          type="date"
                          value={new Date(article.published_time).toISOString().split('T')[0]}
                          readOnly
                          className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isDraft"
                          checked={article.is_draft}
                          onChange={() => {
                            // Toggle draft status
                            useHMRStore.setState(prev => {
                              const updatedArticles = prev.articles.map(a => 
                                a.id === article.id ? { ...a, is_draft: !a.is_draft } : a
                              );
                              
                              return {
                                ...prev,
                                articles: updatedArticles,
                                logEntries: [`${new Date().toLocaleTimeString()}: Estado de borrador cambiado para ${article.title}`, ...prev.logEntries.slice(0, 9)]
                              };
                            });
                          }}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label htmlFor="isDraft" className="ml-2 block text-sm text-gray-700">
                          Marcar como borrador
                        </label>
                      </div>
                      
                      <div className="pt-4">
                        <button
                          onClick={() => {
                            // Toggle draft status
                            useHMRStore.setState(prev => {
                              const updatedArticles = prev.articles.map(a => 
                                a.id === article.id ? { ...a, is_draft: !a.is_draft } : a
                              );
                              
                              return {
                                ...prev,
                                articles: updatedArticles,
                                logEntries: [`${new Date().toLocaleTimeString()}: Estado de borrador cambiado para ${article.title}`, ...prev.logEntries.slice(0, 9)]
                              };
                            });
                          }}
                          className={`px-4 py-2 rounded ${
                            article.is_draft
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                          }`}
                        >
                          {article.is_draft ? 'Publicar Artículo' : 'Convertir a Borrador'}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </section>
            )}
          </div>
        </div>
        
        <section className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Registro de Estados</h2>
          <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg h-40 overflow-y-auto">
            {logEntries.length > 0 ? (
              logEntries.map((entry, index) => (
                <div key={index} className="mb-1">$ {entry}</div>
              ))
            ) : (
              <div className="text-gray-500">$ Esperando eventos de estado...</div>
            )}
          </div>
        </section>
        
        <section className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Características de HMR en Float.js</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span><strong>Preservación de Estado:</strong> El estado de los componentes se mantiene durante las actualizaciones</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span><strong>Actualización Instantánea:</strong> Los cambios se reflejan sin recargar la página</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span><strong>Componentes Reactivos:</strong> Los componentes se actualizan automáticamente</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span><strong>Desarrollo Rápido:</strong> Ciclo de desarrollo acelerado con feedback inmediato</span>
            </li>
          </ul>
        </section>
        
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Edita este archivo para ver cómo HMR mantiene el estado global de la aplicación</p>
        </footer>
      </div>
    </div>
  );
}