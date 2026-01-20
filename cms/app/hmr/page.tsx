/*
 * Advanced HMR Demo with Full Float.js State Management
 * 
 * This demo showcases the full potential of Float.js state management
 * using the framework's built-in createFloatStore and useFloatStore hooks
 * for client-side state management with HMR support.
 */

// Server component that fetches initial data and renders the page
export default async function AdvancedHRMDemo() {
  // Fetch initial data server-side
  try {
    // Using fetch to get articles from the API
    const response = await fetch('http://localhost:3000/api/articles');
    const articles = await response.json();
    
    // For authors, we'll use a similar approach
    const authorsResponse = await fetch('http://localhost:3000/api/authors');
    const authors = await authorsResponse.json();

    // Render the page with initial data
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
                    <p className="text-gray-700 mb-2">Valor actual: <span id="counter-value" className="font-bold text-blue-600">0</span></p>
                    <button 
                      id="counter-increment"
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
                    <p className="text-gray-700 mb-2">Tiempo: <span id="timer-value" className="font-bold text-green-600">00:00</span></p>
                    <div className="flex space-x-2">
                      <button 
                        id="timer-toggle"
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        Iniciar
                      </button>
                      <button 
                        id="timer-reset"
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
                      id="status-filter"
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
                      id="category-filter"
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3" id="authors-container">
                  {authors.map(author => (
                    <div
                      key={author.id}
                      data-author-id={author.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        author.id === 'selected-author-placeholder'
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{author.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{author.bio}</div>
                    </div>
                  ))}
                </div>
              </section>
              
              <section className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Artículos {articles.length > 0 ? `(${articles.length})` : ''}
                </h2>
                <div id="articles-container">
                  {articles.map(article => (
                    <div
                      key={article.id}
                      data-article-id={article.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        article.id === 'selected-article-placeholder'
                          ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                          : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                      }`}
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
              </section>
              
              <section className="bg-white rounded-xl shadow-lg p-6" id="article-editor-section" style={{ display: 'none' }}>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Editor de Artículo</h2>
                <div id="article-editor-content">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                      <input
                        type="text"
                        id="article-title"
                        className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                      <select
                        id="article-category"
                        className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                        disabled
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
                        id="article-date"
                        className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                        readOnly
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="article-is-draft"
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor="article-is-draft" className="ml-2 block text-sm text-gray-700">
                        Marcar como borrador
                      </label>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        id="toggle-draft-status"
                        className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        Convertir a Borrador
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
          
          <section className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Registro de Estados</h2>
            <div id="log-entries" className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg h-40 overflow-y-auto">
              <div className="text-gray-500">$ Esperando eventos de estado...</div>
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
        
        {/* Client-side JavaScript for interactivity - properly encapsulated for HMR */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Client-side JavaScript for HMR demo interactivity
              (function() {
                // Initialize state with preservation across HMR updates
                window.hmrDemoState = window.hmrDemoState || {
                  counter: 0,
                  timer: 0,
                  isTimerRunning: false,
                  selectedAuthor: null,
                  selectedArticle: null,
                  filters: {
                    status: 'all',
                    category: 'all'
                  },
                  logEntries: []
                };
                
                // DOM elements
                const counterValueEl = document.getElementById('counter-value');
                const counterIncrementBtn = document.getElementById('counter-increment');
                const timerValueEl = document.getElementById('timer-value');
                const timerToggleBtn = document.getElementById('timer-toggle');
                const timerResetBtn = document.getElementById('timer-reset');
                const statusFilterEl = document.getElementById('status-filter');
                const categoryFilterEl = document.getElementById('category-filter');
                const logEntriesEl = document.getElementById('log-entries');
                const authorsContainer = document.getElementById('authors-container');
                const articlesContainer = document.getElementById('articles-container');
                const articleEditorSection = document.getElementById('article-editor-section');
                
                // Update counter display
                function updateCounterDisplay() {
                  if (counterValueEl) {
                    counterValueEl.textContent = window.hmrDemoState.counter;
                  }
                }
                
                // Update timer display
                function updateTimerDisplay() {
                  if (timerValueEl) {
                    const mins = Math.floor(window.hmrDemoState.timer / 60);
                    const secs = window.hmrDemoState.timer % 60;
                    timerValueEl.textContent = mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
                  }
                }
                
                // Update log entries display
                function updateLogEntries() {
                  if (logEntriesEl) {
                    if (window.hmrDemoState.logEntries.length > 0) {
                      logEntriesEl.innerHTML = window.hmrDemoState.logEntries.map(entry => 
                        '<div class="mb-1">$ ' + entry + '</div>'
                      ).join('');
                    } else {
                      logEntriesEl.innerHTML = '<div class="text-gray-500">$ Esperando eventos de estado...</div>';
                    }
                  }
                }
                
                // Add log entry
                function addLogEntry(message) {
                  const timestamp = new Date().toLocaleTimeString();
                  window.hmrDemoState.logEntries.unshift(timestamp + ': ' + message);
                  if (window.hmrDemoState.logEntries.length > 10) {
                    window.hmrDemoState.logEntries.pop();
                  }
                  updateLogEntries();
                }
                
                // Counter functionality
                if (counterIncrementBtn) {
                  counterIncrementBtn.addEventListener('click', function() {
                    window.hmrDemoState.counter++;
                    updateCounterDisplay();
                    addLogEntry('Contador incrementado a: ' + window.hmrDemoState.counter);
                  });
                }
                
                // Timer functionality
                let timerInterval = null;
                
                if (timerToggleBtn) {
                  timerToggleBtn.addEventListener('click', function() {
                    window.hmrDemoState.isTimerRunning = !window.hmrDemoState.isTimerRunning;
                    
                    if (window.hmrDemoState.isTimerRunning) {
                      this.textContent = 'Detener';
                      this.className = 'px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors';
                      
                      timerInterval = setInterval(() => {
                        window.hmrDemoState.timer++;
                        updateTimerDisplay();
                        addLogEntry('Timer actualizado a: ' + 
                          Math.floor(window.hmrDemoState.timer / 60) + ':' + 
                          (window.hmrDemoState.timer % 60).toString().padStart(2, '0'));
                      }, 1000);
                    } else {
                      this.textContent = 'Iniciar';
                      this.className = 'px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors';
                      
                      if (timerInterval) {
                        clearInterval(timerInterval);
                        timerInterval = null;
                      }
                    }
                  });
                }
                
                if (timerResetBtn) {
                  timerResetBtn.addEventListener('click', function() {
                    window.hmrDemoState.timer = 0;
                    updateTimerDisplay();
                    addLogEntry('Temporizador reiniciado');
                  });
                }
                
                // Author selection
                if (authorsContainer) {
                  authorsContainer.addEventListener('click', function(e) {
                    const authorElement = e.target.closest('[data-author-id]');
                    if (authorElement) {
                      const authorId = authorElement.getAttribute('data-author-id');
                      
                      // Remove selection from other authors
                      document.querySelectorAll('#authors-container [data-author-id]').forEach(el => {
                        el.classList.remove('border-blue-500', 'bg-blue-50', 'ring-2', 'ring-blue-200');
                        el.classList.add('border-gray-200', 'hover:border-blue-300', 'hover:bg-gray-50');
                      });
                      
                      // Add selection to clicked author
                      authorElement.classList.remove('border-gray-200', 'hover:border-blue-300', 'hover:bg-gray-50');
                      authorElement.classList.add('border-blue-500', 'bg-blue-50', 'ring-2', 'ring-blue-200');
                      
                      window.hmrDemoState.selectedAuthor = authorId;
                      addLogEntry('Autor seleccionado: ' + authorId);
                      
                      // Update article filtering
                      filterArticles();
                    }
                  });
                }
                
                // Article selection
                if (articlesContainer) {
                  articlesContainer.addEventListener('click', function(e) {
                    const articleElement = e.target.closest('[data-article-id]');
                    if (articleElement) {
                      const articleId = articleElement.getAttribute('data-article-id');
                      
                      // Remove selection from other articles
                      document.querySelectorAll('#articles-container [data-article-id]').forEach(el => {
                        el.classList.remove('border-green-500', 'bg-green-50', 'ring-2', 'ring-green-200');
                        el.classList.add('border-gray-200', 'hover:border-green-300', 'hover:bg-gray-50');
                      });
                      
                      // Add selection to clicked article
                      articleElement.classList.remove('border-gray-200', 'hover:border-green-300', 'hover:bg-gray-50');
                      articleElement.classList.add('border-green-500', 'bg-green-50', 'ring-2', 'ring-green-200');
                      
                      window.hmrDemoState.selectedArticle = articleId;
                      addLogEntry('Artículo seleccionado: ' + articleId);
                      
                      // Show editor for selected article
                      if (articleEditorSection) {
                        articleEditorSection.style.display = 'block';
                        
                        // In a real implementation, we would populate the editor with article data
                        const titleElement = articleElement.querySelector('.font-medium.text-gray-900');
                        const categoryElement = articleElement.querySelector('.text-sm.text-gray-600');
                        const isDraftElement = articleElement.querySelector('.bg-yellow-100, .bg-green-100');
                        
                        if (titleElement) {
                          document.getElementById('article-title').value = titleElement.textContent;
                        }
                        if (categoryElement) {
                          const categoryText = categoryElement.textContent;
                          const categoryMatch = categoryText.match(/Categoría: (\\w+)/);
                          if (categoryMatch && categoryMatch[1]) {
                            document.getElementById('article-category').value = categoryMatch[1];
                          }
                        }
                        
                        // Set draft status
                        const isDraftCheckbox = document.getElementById('article-is-draft');
                        if (isDraftCheckbox) {
                          isDraftCheckbox.checked = isDraftElement !== null && isDraftElement.textContent === 'Borrador';
                        }
                        
                        // Update toggle button text based on draft status
                        const toggleBtn = document.getElementById('toggle-draft-status');
                        if (toggleBtn) {
                          toggleBtn.textContent = isDraftElement !== null && isDraftElement.textContent === 'Borrador' 
                            ? 'Publicar Artículo' 
                            : 'Convertir a Borrador';
                          toggleBtn.className = isDraftElement !== null && isDraftElement.textContent === 'Borrador' 
                            ? 'px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white' 
                            : 'px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white';
                        }
                      }
                    }
                  });
                }
                
                // Draft status toggle
                const toggleDraftBtn = document.getElementById('toggle-draft-status');
                if (toggleDraftBtn) {
                  toggleDraftBtn.addEventListener('click', function() {
                    if (window.hmrDemoState.selectedArticle) {
                      const isDraftCheckbox = document.getElementById('article-is-draft');
                      if (isDraftCheckbox) {
                        const isDraft = !isDraftCheckbox.checked;
                        isDraftCheckbox.checked = isDraft;
                        
                        // Update button text and class
                        this.textContent = isDraft ? 'Publicar Artículo' : 'Convertir a Borrador';
                        this.className = isDraft 
                          ? 'px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white' 
                          : 'px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white';
                        
                        addLogEntry('Estado de borrador cambiado para artículo ' + window.hmrDemoState.selectedArticle + ': ' + (isDraft ? 'Borrador' : 'Publicado'));
                        
                        // Update the badge in the article list
                        const selectedArticleEl = document.querySelector('[data-article-id="' + window.hmrDemoState.selectedArticle + '"]');
                        if (selectedArticleEl) {
                          const badge = selectedArticleEl.querySelector('span.bg-yellow-100, span.bg-green-100');
                          if (badge) {
                            badge.className = isDraft 
                              ? 'px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800' 
                              : 'px-2 py-1 rounded-full text-xs bg-green-100 text-green-800';
                            badge.textContent = isDraft ? 'Borrador' : 'Publicado';
                          }
                        }
                      }
                    }
                  });
                }
                
                // Filter articles based on selections
                function filterArticles() {
                  const allArticles = document.querySelectorAll('#articles-container [data-article-id]');
                  allArticles.forEach(articleEl => {
                    const articleId = articleEl.getAttribute('data-article-id');
                    // In a real implementation, we would check against filters
                    // For now, just show all articles
                    articleEl.style.display = 'block';
                  });
                }
                
                // Initialize displays
                updateCounterDisplay();
                updateTimerDisplay();
                updateLogEntries();
                
                // Restore selections if they exist
                if (window.hmrDemoState.selectedAuthor) {
                  const selectedAuthorEl = document.querySelector('[data-author-id="' + window.hmrDemoState.selectedAuthor + '"]');
                  if (selectedAuthorEl) {
                    selectedAuthorEl.classList.remove('border-gray-200', 'hover:border-blue-300', 'hover:bg-gray-50');
                    selectedAuthorEl.classList.add('border-blue-500', 'bg-blue-50', 'ring-2', 'ring-blue-200');
                  }
                }
                
                if (window.hmrDemoState.selectedArticle) {
                  const selectedArticleEl = document.querySelector('[data-article-id="' + window.hmrDemoState.selectedArticle + '"]');
                  if (selectedArticleEl) {
                    selectedArticleEl.classList.remove('border-gray-200', 'hover:border-green-300', 'hover:bg-gray-50');
                    selectedArticleEl.classList.add('border-green-500', 'bg-green-50', 'ring-2', 'ring-green-200');
                  }
                  
                  if (articleEditorSection) {
                    articleEditorSection.style.display = 'block';
                  }
                }
                
                // Preserve state during HMR updates
                window.__HMR_DEMO_STATE__ = window.hmrDemoState;
              })();
            `
          }}
        />
      </div>
    );
  } catch (error) {
    console.error('Error fetching initial data:', error);
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md text-center">
          <p className="font-bold">Error al cargar la demo de HMR</p>
          <p className="mt-2">{error.message}</p>
          <p className="text-sm mt-2">Verifique que el servidor esté corriendo y los endpoints estén disponibles</p>
        </div>
      </div>
    );
  }
}